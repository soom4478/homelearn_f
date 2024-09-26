import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import returnIcon from "../image/return.png";
import star from "../image/star.png";
import map from "../image/mapIcon.png";
import StarRating from "./starRating"; // StarRating 컴포넌트 가져오기
import "./foodDetail.css";


const FoodDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [activeCategory, setActiveCategory] = useState('cate1');
  const [store, setStore] = useState(null);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [topReview, setTopReview] = useState(null);

  // 가게 정보 가져오기
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`http://3.138.127.122:5000/api/foodshop/${process.env.REACT_APP_API_KEY}/${storeId}`);
        setStore(response.data); // 가게 정보 상태 설정
        console.log(response.data); // 데이터를 콘솔에 출력하여 확인합니다.
      } catch (error) {
        console.error("Error fetching store:", error); // 오류 로그 출력
      }
    };
    fetchStore();
  }, [storeId]);

  // 메뉴 정보 가져오기
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`http://3.138.127.122:5000/api/foodshopmenu/${process.env.REACT_APP_API_KEY}/${storeId}`);
        setMenus(response.data); // 메뉴 상태 설정
        console.log(response.data); // 데이터를 콘솔에 출력하여 확인합니다.
      } catch (error) {
        console.error("Error fetching menus:", error); // 오류 로그 출력
      }
    };
    fetchMenus();
  }, [storeId]);

  // 리뷰 정보 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://3.138.127.122:5000/api/foodshopreview/${process.env.REACT_APP_API_KEY}/${storeId}`);
        setReviews(response.data); // 리뷰 상태 설정
        console.log(response.data); // 데이터를 콘솔에 출력하여 확인합니다.
        
        // topReview를 첫 번째 리뷰로 설정 (필요에 따라 수정 가능)
        if (response.data.length > 0) {
          setTopReview(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error); // 오류 로그 출력
      }
    };
    fetchReviews();
  }, [storeId]);

  const handleReviewClick = () => {
    navigate(`/review/${store.id}`, { state: { store } });
  };

  const handleReturnClick = () => {
    navigate(-1); // 뒤로 이동
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  if (!store) {
    return <div>Store not found</div>;
  }

  // 카테고리 필터링
  const s_menus = menus.filter((item) => item.category === '세트');
  const o_menus = menus.filter((item) => item.category === '단품');
  const d_menus = menus.filter((item) => item.category === '음료');

  return (
    <div className="foodDcon1">
      <div className="foodDcon2">
        <div className='calender-con'>
          <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} />
          <p id='foodDetail-title'>{store.name}</p>
        </div>
      </div>
      {store && (
        <img id="storeImg" src={store.image_url}  />
      )}
      <div className="foodDcon6">
        <div className="foodDcon3">
          <div className="starDcon">
            <img id="star" src={star} alt="star" />
            <p id="star_point" className="star_point">{store.star}</p>
          </div>
          <div className="location">
            <img id="map" src={map} alt="map" />
            <p id="locationT">{store.location}</p>
          </div>
        </div>
        <div className="foodDcon4">
          <p id="reviewN" onClick={handleReviewClick}>리뷰 {reviews.length}개 {">"}</p>
          <div className="foodDcon5">
            {topReview && (
              <>
                <div className="populerReviewImg" style={{ backgroundImage: `url(${topReview.image_url})` }}></div>
                <div className="foodDcon7">
                  <StarRating rating={topReview.rating} starSize={20} /> {/* StarRating 컴포넌트 사용 */}
                  <p id="reviewText">{topReview.content}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="foodDcate">
          <div className={`cate1 ${activeCategory === 'cate1' ? 'cateActive' : ''}`} onClick={() => handleCategoryClick('cate1')}>
            <p>전체</p>
          </div>
          <div className={`cate2 ${activeCategory === 'cate2' ? 'cateActive' : ''}`} onClick={() => handleCategoryClick('cate2')}>
            <p>Set</p>
          </div>
          <div className={`cate4 ${activeCategory === 'cate4' ? 'cateActive' : ''}`} onClick={() => handleCategoryClick('cate4')}>
            <p>단품</p>
          </div>
          <div className={`cate5 ${activeCategory === 'cate5' ? 'cateActive' : ''}`} onClick={() => handleCategoryClick('cate5')}>
            <p>음료</p>
          </div>
        </div>
        <div className="noneCon"></div>
        {(activeCategory === 'cate1' || activeCategory === 'cate2') && (
          <div className="setCon">
            {s_menus.length > 0 && (
              <>
                <div className="foodDcon8">
                  <p id="cateText">Set</p>
                </div>
                {s_menus.map((menu, index) => (
                  <div key={index} className="foodDcon9">
                    <p id="nameT">{menu.name}</p>
                    <p id="priceT">{menu.price}원</p>
                  </div>
                ))}
              </>
            )}
            <div className="noneCon"></div>
          </div>
        )}
        {(activeCategory === 'cate1' || activeCategory === 'cate4') && (
          <div className="oneCon">
            {o_menus.length > 0 && (
              <>
                <div className="foodDcon8">
                  <p id="cateText">단품</p>
                </div>
                {o_menus.map((menu, index) => (
                  <div key={index} className="foodDcon9">
                    <p id="DtailT">{menu.detail}</p>
                    <p id="nameT">{menu.name}</p>
                    <p id="priceT">{menu.price}원</p>
                  </div>
                ))}
              </>
            )}
            <div className="noneCon"></div>
          </div>
        )}
        {(activeCategory === 'cate1' || activeCategory === 'cate5') && (
          <div className="drinkCon">
            {d_menus.length > 0 && (
              <>
                <div className="foodDcon8">
                  <p id="cateText">음료</p>
                </div>
                {d_menus.map((menu, index) => (
                  <div key={index} className="foodDcon9">
                    <p id="DtailT">{menu.detail}</p>
                    <p id="nameT">{menu.name}</p>
                    <p id="priceT">{menu.price}원</p>
                  </div>
                ))}
                <div className="noneCon"></div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;
