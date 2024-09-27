import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import arrowIcon from "../image/open2_1.png";
import search_icon from "../image/search_icon.png";
import search_icon2 from "../image/search_icon2.png";
import beer from "../image/beer.png";
import star from "../image/star.png";
import { useNavigate } from "react-router-dom";
import "./foodMain.css";

const FoodMain = () => {
    const [foodShops, setFoodShops] = useState([]); // 빈 배열로 초기화
    const [error, setError] = useState(null);
    const [activeBlock, setActiveBlock] = useState("전체");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState("잠실 야구장"); 
    const [searchIcon, setSearchIcon] = useState(search_icon);
    const selectRef = useRef(null);
    const navigate = useNavigate();
    
    // API 키를 환경 변수에서 가져옵니다.
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        const fetchFoodShops = async () => {
            try {
                const response = await axios.get(`http://3.138.127.122:5000/api/foodshop/${apiKey}`);
                const foodShopsData = response.data;
                // 각 음식점 ID로 리뷰 수 가져오기
                const reviewCounts = await Promise.all(
                    foodShopsData.map(shop =>
                        axios.get(`http://3.138.127.122:5000/api/foodshopreview/${apiKey}/${shop.id}`)
                            .then(reviewResponse => reviewResponse.data.length)
                            .catch(() => 0) // 오류 발생 시 0으로 설정
                    )
                );

                // 리뷰 수를 음식점 데이터에 추가
                const foodShopsWithReviews = foodShopsData.map((shop, index) => ({
                    ...shop,
                    reviewCount: reviewCounts[index],
                }));


                setFoodShops(foodShopsWithReviews);
            } catch (error) {
                setError('Failed to fetch food shops');
            }
        };

        fetchFoodShops();
    }, [apiKey]); // apiKey 의존성 추가

    const handleClick = (category) => {
        setActiveBlock(category);
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        setSearchIcon(search_icon2);
        setTimeout(() => {
            setSearchIcon(search_icon);
        }, 100);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleStoreClick = (storeId) => {
        navigate(`/food/${storeId}`);
    };

    // foodShops가 있을 때만 map 실행
    const uniqueHomegrounds = foodShops.length > 0 
        ? [...new Set(foodShops.map(shop => shop.homeground))].slice(0, 10) 
        : [];

    const uniqueCategories = ["전체", ...new Set(
        foodShops
        .filter(shop => shop.homeground === selectedOption)
        .map(shop => shop.category)
    )];

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <nav>
            <div className="dropdown">
                <select
                    ref={selectRef}
                    value={selectedOption}
                    onChange={handleSelectChange}
                >
                    {uniqueHomegrounds.map((homeground, index) => (
                        <option key={index} value={homeground}>
                            {homeground}
                        </option>
                    ))}
                </select>
                <img
                    src={arrowIcon}
                    alt="arrow_icon"
                    className="arrow-icon"
                    style={{ left: 'calc(100% - 20px)' }}
                />
            </div>
            
            <div className="search">
                <input
                    type="text"
                    id="input"
                    placeholder="검색어를 입력해주세요"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <img
                    id="search_icon"
                    src={searchIcon}
                    alt="search_icon"
                    onClick={handleSearchClick}
                />
            </div>

            <div className="container2">
            <div className="display">
                <div className="text">
                    <p id="beer1">{selectedOption}에서</p> {/* 선택된 옵션 값으로 변경 */}
                    <h3 id="beer2">맥주와 함께할 음식 추천받기</h3>
                </div>
                <img id="beer_img" src={beer} alt="beer" />
            </div>
                <div id="text2">
                    <p>인기매장 메뉴 추천</p>
                </div>

                <div className="category">
                    {uniqueCategories.map((category) => (
                        <div
                            key={category}
                            id="block"
                            className={activeBlock === category ? "active" : ""}
                            onClick={() => handleClick(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>

                {foodShops
                    .filter(store => 
                        (activeBlock === "전체" || store.category === activeBlock) &&
                        (selectedOption === "" || store.homeground === selectedOption) &&
                        (searchTerm === "" || store.name.includes(searchTerm))
                    )
                    .map((store, index) => (
                        <div className="store" key={index} onClick={() => handleStoreClick(store.id)}>
                            <img id="img1" src={store.image_url} alt="img1" />
                            <div className="storeIfo">
                                <h3 id="store_name">{store.name}</h3>
                                <img id="star" src={star} alt="star" />
                                <p id="star_point">{store.star}</p>
                                <div className="popurler">
                                    <p id="info_text">리뷰 수</p>
                                    <p id="review_count">{store.reviewCount}</p> {/* 리뷰 수 표시 */}
                                </div>
                                <div className="order">
                                    <p id="info_text">오늘 주문수</p>
                                    <p id="today_order">{store.today_order}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </nav>
    );
};

export default FoodMain;
