import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductStart, setProduct } from '../../redux/Products/products.action';
import { addProduct } from '../../redux/Cart/cart.actions';
import Button from '../forms/Button/index';
import './styles.scss';

const mapState = state => ({
    product: state.productsData.product
});

const ProductCard = () => {
    const dispatch = useDispatch();
    const { productID } = useParams();
    const { product } = useSelector(mapState);

    const { productName, productThumbnail, productPrice, productDesc } = product;

    useEffect(() => {
        dispatch(
            fetchProductStart(productID)
        )

        return () => {
            dispatch(
                setProduct({})
            )
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const configAddToCartBtn = {
        type: 'button'
    }

    const handleAddToCart = (product) => {
        if(!product) return;
        dispatch(
            addProduct(product)
        )
    }

    return (
        <div className="productCard">
            <div className="hero">
                <img src={ productThumbnail } alt='' />
            </div>
            <div className="productDetails">
                <ul>
                    <li>
                        <h1>
                            { productName }
                        </h1>
                    </li>
                    <li>
                        <span 
                            className="description"
                            dangerouslySetInnerHTML={{ __html: productDesc }} />
                    </li>
                    <li>
                        <span>
                            ${ productPrice }
                        </span>
                    </li>
                    <li>
                        <div className="addToCart">
                            <Button {...configAddToCartBtn} onClick={() => handleAddToCart(product)}>
                                Añadir al carrito
                            </Button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ProductCard
