/* eslint-disable max-len */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetails.scss';
import classNames from 'classnames';
import { Product } from '../../types/productType';
import { detailGet } from '../../utils/fetchClient';
import { Breadcrumbs } from '../../components/BreadCrumbs';
import { Detail } from '../../types/detailType';
import { ProductSlider } from '../../components/ProductSlider/ProductSlider';
import { CartItem } from '../../types/cartType';
import heart from '../../icons/favorite.svg';
import heartAdded from '../../icons/favoriteLiked.svg';

type Props = {
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>,
  favorites: Product[],
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
  products: Product[]
};

export const ProductDetailsPage: React.FC<Props> = ({
  setFavorites,
  favorites,
  cartItems,
  setCartItems,
  products,
}) => {
  const location = useLocation();
  const [productId, setProductId]
    = useState(location.pathname.slice(location.pathname.lastIndexOf('/') + 1));
  const [productDetails, setProductDetails] = useState<Detail | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [suggestedProducts]
    = useState([...products].sort(() => Math.random() - 0.5));
  const navigate = useNavigate();
  const currentProduct = products.find(product => (
    product.itemId === productDetails?.id));
  let isItFavoriteProduct = favorites.find(favorite => (
    favorite.itemId === productDetails?.id));
  let isCardAdded = cartItems.find(cart => (
    cart.product.itemId === productDetails?.id
  ));

  useEffect(() => {
    isItFavoriteProduct = favorites.find(favorite => (
      favorite.itemId === productDetails?.id));
  }, [favorites]);

  useEffect(() => {
    isCardAdded = cartItems.find(cart => (
      cart.product.itemId === productDetails?.id
    ));
  }, [cartItems]);

  useEffect(() => {
    setProductId(location.pathname.slice(location.pathname.lastIndexOf('/') + 1));
  }, [location.pathname]);

  useEffect(() => {
    setLoading(true);
    detailGet<Detail>(productId)
      .then((data) => setProductDetails(data))
      .catch(() => setErrorMessage('Something gone wrong'))
      .finally(() => setLoading(false));
  }, [location.pathname]);

  useEffect(() => {
    setSelectedPicture(productDetails?.images[0] || null);
  }, [productDetails]);

  const hendleSettingFavorites = () => {
    if (currentProduct) {
      if (isItFavoriteProduct) {
        setFavorites(prev => prev.filter(item => (
          item.itemId !== currentProduct?.itemId
        )));
      } else {
        setFavorites(prev => [...prev, currentProduct]);
      }
    }
  };

  const addToCart = () => {
    if (currentProduct) {
      const existingItem = cartItems.find((item) => (
        item.id === +currentProduct?.id
      ));

      if (!existingItem) {
        // Product is not in the cart, add it
        setCartItems((prevItems) => (
          [...prevItems, {
            id: +currentProduct.id,
            quantity: 1,
            product: currentProduct,
          }]
        ));
      }
    }
  };

  return (

    !loading && !errorMessage ? (
      <>
        <div className="breadcrumbs-wraper" data-cy="breadCrumbs">
          <Breadcrumbs />
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="return-button"
        >
          Back
        </button>

        <h1 className="title details__title">
          {productDetails?.name}
        </h1>
        <div className="details-container">
          <div className="details__main">
            <div className="details__main-gallery gallery">
              <ul className="gallery__list list">
                {productDetails?.images.map((image) => (
                  <li className="list__item" key={image}>
                    <button
                      type="button"
                      className={classNames('list__item-button', {
                        'list__item-button--active': selectedPicture === image,
                      })}
                      onClick={() => setSelectedPicture(image)}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}./_new/${image}`}
                        className="list__item-img"
                        alt="thumb"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              {selectedPicture && (
                <img
                  className="gallery__main-photo"
                  src={`${process.env.PUBLIC_URL}./_new/${selectedPicture}`}
                  alt="Selected"
                />
              )}
            </div>
            <div className="details__main-info">
              <div className="details__price price">
                <h1 className="price__full">
                  {`$${productDetails?.priceDiscount}`}
                </h1>

                <span className="price__discount">
                  {`$${productDetails?.priceRegular}`}
                </span>
              </div>
              <div className="details__actions-wrapper">
                <div className="actions">
                  <button
                    type="button"
                    className={classNames('actions__add-to-cart', {
                      'actions__add-to-cart--added': isCardAdded,
                    })}
                    onClick={() => addToCart()}
                  >
                    {isCardAdded
                      ? 'Added to cart'
                      : 'Add to cart'}
                  </button>
                  <button
                    type="button"
                    aria-label="Add to favourites"
                    className="actions__add-to-favorites"
                    data-cy="addToFavorite"
                    onClick={() => hendleSettingFavorites()}
                  >
                    <img
                      className="add-to-favorites__icon"
                      src={
                        isItFavoriteProduct
                          ? heartAdded.toString()
                          : heart.toString()
                      }
                      alt="icon"
                    />
                  </button>
                </div>
              </div>
              <ul className="details__specs">
                <li className="details__spec">
                  <span className="details__spec-name">
                    Screen
                  </span>
                  <span className="details__spec-value">
                    {productDetails?.screen}
                  </span>
                </li>
                <li className="details__spec">
                  <span className="details__spec-name">
                    Resolution
                  </span>
                  <span className="details__spec-value">
                    {productDetails?.resolution}
                  </span>
                </li>
                <li className="details__spec">
                  <span className="details__spec-name">
                    Processor
                  </span>
                  <span className="details__spec-value">
                    {productDetails?.processor}
                  </span>
                </li>
                <li className="details__spec">
                  <span className="details__spec-name">
                    RAM
                  </span>
                  <span className="details__spec-value">
                    {productDetails?.ram}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="details__description">
            <div
              data-cy="productDescription"
              className="details__description-about description-about"
            >
              <h2 className="description-about__title">About</h2>
              <div className="description-about__paragraphs">
                <p className="description-about__paragraph">
                  {productDetails?.description[0].text}
                </p>
                <br />
                <p className="description-about__paragraph">
                  {productDetails?.description[1].text}
                </p>
                <br />
                <p className="description-about__paragraph">
                  {productDetails?.description[2].text}
                </p>
              </div>

            </div>
            <div
              data-cy="productDescription"
              className="details__description-tech-specs description-tech-specs"
            >
              <h2 className="description-tech-specs__title">Tech specs</h2>
              <ul className="description-tech-specs__list">
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    Screen
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.screen}
                  </span>
                </li>
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    Resolution
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.resolution}
                  </span>
                </li>
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    RAM
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.ram}
                  </span>
                </li>
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    Built in memory
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.capacity}
                  </span>
                </li>
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    Processor
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.processor}
                  </span>
                </li>
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    Zoom
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.zoom}
                  </span>
                </li>
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    Cell
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.cell}
                  </span>
                </li>
                <li className="description-tech-specs__item">
                  <span className="description-tech-specs__item-name">
                    Camera
                  </span>
                  <span className="description-tech-specs__item-value">
                    {productDetails?.camera}
                  </span>
                </li>
              </ul>

            </div>
          </div>
        </div>

        <div className="product-slider-wrapper">
          <ProductSlider
            products={suggestedProducts}
            title="You may also like"
            step={1}
            itemWidth={286}
            animationDuration={500}
            infinite={false}
            setFavorites={setFavorites}
            favorites={favorites}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        </div>
      </>
    )
      : (<h1>{errorMessage}</h1>)
  );
};