import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import returnIcon from "../image/return.png";
import reviewStar from "../image/viewStar.png";
import emptyStar from "../image/viewEmpty.png";
import comuBtn from "../image/comuBtn.png";
import "./review.css";
import Rating from '@mui/material/Rating';
import axios from "axios"; // Axios를 임포트

const Review = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState({ star: 0 }); // store 객체로 초기화 (별점만 가져옴)
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [error, setError] = useState(null);

    const handleReturnClick = () => {
        navigate(-1); // 뒤로 이동
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value); // 정렬 옵션 변경
    };

    const handleWriteClick = () => {
        navigate("/review/write", { state: { storeId } }); // storeId를 state로 전달
    };

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                // 음식점 데이터 가져오기
                const storeResponse = await axios.get(`http://3.138.127.122:5000/api/foodshop/${process.env.REACT_APP_API_KEY}/${storeId}`);
                const fetchedStore = storeResponse.data;
                setStore(fetchedStore);


                // 리뷰 데이터 가져오기
                const reviewResponse = await axios.get(`http://3.138.127.122:5000/api/foodshopreview/${process.env.REACT_APP_API_KEY}/${storeId}`);
                setReviews(reviewResponse.data); // 리뷰 데이터 설정
            } catch (err) {
                console.error(err);
                setError('정보를 불러오는 데 실패했습니다.'); // 오류 메시지 설정
            }
        };

        fetchStoreData(); // 데이터 가져오기
    }, [storeId]);

    // 리뷰 정렬 (최신순, 평점 높은순, 평점 낮은순)
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortOption === "latest") {
            return new Date(b.time) - new Date(a.time);
        } else if (sortOption === "highRating") {
            return b.rating - a.rating; // review의 rating 사용
        } else {
            return a.rating - b.rating; // review의 rating 사용
        }
    });

    return (
        <div className="reviewCon1">
            <div className="foodDcon1">
                <div className="foodDcon2">
                    <div className='calender-con'>
                        <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} /> {/* 클릭 이벤트 핸들러 추가 */}
                        <p id='foodDetail-title'>리뷰</p>
                    </div>
                </div>
            </div>
            <div className="reviewStarCon">
                <span className="reviewStar">
                    <Rating
                        value={store.star}
                        precision={0.5}
                        readOnly
                        icon={<img src={reviewStar} alt="review star" style={{ width: '30px', height: '30px' }} />}
                        emptyIcon={<img src={emptyStar} alt="empty star" style={{ width: '30px', height: '30px' }} />}
                    />
                    <p id="starPointView">{store.star}</p> {/* 음식점 평균 별점 */}
                </span>
            </div>
            <div className="reviewCon2">
                <span id="reviewCount">리뷰 {sortedReviews.length}개</span> {/* 리뷰 개수 표시 */}
                <select className="reviewDrop" value={sortOption} onChange={handleSortChange}>
                    <option value="latest">최신순</option>
                    <option value="highRating">평점 높은순</option>
                    <option value="lowRating">평점 낮은순</option>
                </select>
            </div>
            <div className="reviewCon3">
                {sortedReviews.map((review, index) => (
                    <div className='reviewCon4' key={index}>
                        <div className='cmtCon'>
                            <div className='reviewPropile'></div>
                            <div className='comuUser'>
                                <p id='uname'>{review.name}</p>
                                <p id='utime'>{review.time}</p>
                            </div>
                        </div>
                        {review.image_url && (<img src={review.image_url} alt="Review" className="reviewImg" />)}
                        <div className="reviewRating">
                            <Rating
                                name={`review-rating-${index}`}
                                value={review.rating} // 리뷰의 별점
                                precision={0.5}
                                readOnly
                                icon={<img src={reviewStar} alt="review star" style={{ width: '20px', height: '20px' }} />}
                                emptyIcon={<img src={emptyStar} alt="empty star" style={{ width: '20px', height: '20px' }} />}
                            />
                        </div>
                        <div className="reviewText">{review.content}</div>
                    </div>
                ))}
            </div>
            <img id="comuBtn" src={comuBtn} alt="comuBtn" onClick={handleWriteClick} />
            {error && <p className="error">{error}</p>} {/* 오류 메시지 표시 */}
        </div>
    );
};

export default Review;
