import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CountryDropdown } from "react-country-region-selector";
import { createStructuredSelector } from "reselect";
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from "../../redux/Cart/cart.selectors";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiInstance } from "../../Utils";
import { saveOrderHistory } from "../../redux/Orders/orders.action";
import FormInput from "../forms/FormInput/index";
import Button from "../forms/Button/index";
import "./styles.scss";

const initialState = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};

const mapState = createStructuredSelector({
  total: selectCartTotal,
  itemCount: selectCartItemsCount,
  cartItems: selectCartItems,
});

const PaymentDetails = () => {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const dispatch = useDispatch();
  const { total, itemCount, cartItems } = useSelector(mapState);
  const [billingAddress, setBillingAddress] = useState({ ...initialState });
  const [shippingAddress, setshippingAddress] = useState({ ...initialState });
  const [recipientName, setrecipientName] = useState("");
  const [nameOnCard, setnameOnCard] = useState("");

  useEffect(() => {
    if (itemCount < 1) {
      history.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

  const handleShipping = (evt) => {
    const { name, value } = evt.target;
    setshippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handleBilling = (evt) => {
    const { name, value } = evt.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const cardElement = elements.getElement("card");

    if (
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postal_code ||
      !shippingAddress.country ||
      !billingAddress.line1 ||
      !billingAddress.city ||
      !billingAddress.state ||
      !billingAddress.postal_code ||
      !billingAddress.country ||
      !recipientName ||
      !nameOnCard
    ) {
      return;
    }

    apiInstance
      .post("/payments/create", {
        amount: total * 100,
        shipping: {
          name: recipientName,
          address: {
            ...shippingAddress,
          },
        },
      })
      .then(({ data: clientSecret }) => {
        stripe
          .createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name: nameOnCard,
              address: {
                ...billingAddress,
              },
            },
          })
          .then(({ paymentMethod }) => {
            stripe
              .confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
              })
              .then(({ paymentIntent }) => {
                const configOrder = {
                  orderTotal: total,
                  orderItems: cartItems.map((item) => {
                    const {
                      documentID,
                      productThumbnail,
                      productName,
                      productPrice,
                      quantity,
                    } = item;

                    return {
                      documentID,
                      productThumbnail,
                      productName,
                      productPrice,
                      quantity,
                    };
                  }),
                };

                dispatch(saveOrderHistory(configOrder));
              });
          });
      });
  };

  const configCardElement = {
    iconStyle: "solid",
    style: {
      base: {
        fontSize: "16px",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="paymentDetails">
      <form onSubmit={handleFormSubmit}>
        <div className="group">
          <h2>Shipping Address</h2>

          <FormInput
            required
            placeholder="Nombre"
            type="text"
            value={recipientName}
            handleChange={(e) => setrecipientName(e.target.value)}
          />

          <FormInput
            required
            placeholder="Line 1"
            type="text"
            name="line1"
            value={shippingAddress.line1}
            handleChange={(e) => handleShipping(e)}
          />

          <FormInput
            placeholder="Line 2"
            type="text"
            name="line2"
            value={shippingAddress.line2}
            handleChange={(e) => handleShipping(e)}
          />

          <FormInput
            required
            placeholder="Ciudad"
            type="text"
            name="city"
            value={shippingAddress.city}
            handleChange={(e) => handleShipping(e)}
          />

          <FormInput
            required
            placeholder="Estado"
            type="text"
            name="state"
            value={shippingAddress.state}
            handleChange={(e) => handleShipping(e)}
          />

          <FormInput
            required
            placeholder="Codigo postal"
            type="text"
            name="postal_code"
            value={shippingAddress.postal_code}
            handleChange={(e) => handleShipping(e)}
          />

          <CountryDropdown
            required
            valueType="short"
            float="left"
            value={shippingAddress.country}
            onChange={(val) =>
              handleShipping({
                target: {
                  name: "country",
                  value: val,
                },
              })
            }
          />
        </div>

        <div className="group">
          <h2>Billing addres</h2>
          <FormInput
            required
            placeholder="Name"
            type="text"
            value={nameOnCard}
            handleChange={(e) => setnameOnCard(e.target.value)}
          />

          <FormInput
            required
            placeholder="Line 1"
            type="text"
            name="line1"
            value={billingAddress.line1}
            handleChange={(e) => handleBilling(e)}
          />

          <FormInput
            placeholder="Line 2"
            type="text"
            name="line2"
            value={billingAddress.line2}
            handleChange={(e) => handleBilling(e)}
          />

          <FormInput
            required
            placeholder="Ciudad"
            type="text"
            name="city"
            value={billingAddress.city}
            handleChange={(e) => handleBilling(e)}
          />

          <FormInput
            required
            placeholder="Estado"
            type="text"
            name="state"
            value={billingAddress.state}
            handleChange={(e) => handleBilling(e)}
          />

          <FormInput
            required
            placeholder="Codigo postal"
            type="text"
            name="postal_code"
            value={billingAddress.postal_code}
            handleChange={(e) => handleBilling(e)}
          />
        </div>

        <div className="group">
          <h2>Detalles de tarjeta</h2>
          <CardElement options={configCardElement} />
        </div>

        <Button type="submit">Pagar ahora</Button>
      </form>
    </div>
  );
};

export default PaymentDetails;
