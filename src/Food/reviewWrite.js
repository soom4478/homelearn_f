import React, { useState } from "react";
import "./reviewWrite.css";
import returnIcon from "../image/xIcon.png";
import imgInput from "../image/imgInput.png";
import reviewStar from "../image/viewStar.png";
import emptyStar from "../image/viewEmpty.png";
import Rating from '@mui/material/Rating';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';  
import { useReviewImfo } from "./reviewImfo"; 

const ReviewWrite = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { storeId } = location.state; 
    const { reviews, setReviews } = useReviewImfo(); 
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [imageFile, setImageFile] = useState(null); 
    const [imagePreview, setImagePreview] = useState(null); 
    const [error, setError] = useState(null); 

    const handleReturnClick = () => {
        navigate(-1);
    };

    const handleCompleteClick = async () => {
        // 로컬 스토리지에서 userId 가져오기
        const userId = localStorage.getItem('userId');
        
        // 필수 필드 체크
        if (!storeId || !text.trim() || rating === 0 || !userId) {
            setError('모든 필드를 채워주세요. (상점, 리뷰 내용, 별점, 유저 아이디)');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('shopId', storeId);
            formData.append('userId', userId);  // 로컬 스토리지에서 가져온 userId
            formData.append('content', text);
            formData.append('rating', rating);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await axios.post(`http://localhost:5000/api/foodshopreview/${process.env.REACT_APP_API_KEY}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            

            setReviews([...reviews, response.data]);
            navigate(-1);
        } catch (err) {
            console.error("Response data:", err.response ? err.response.data : err);
            setError('리뷰 작성에 실패했습니다.');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // 미리보기 URL 생성
        }
    };

    return (
        <div className="reviewWcon1">
            <div className='comuTcon'>
                <div className="comuWcon2">
                    <div className='calender-con'>
                        <img id="return" src={returnIcon} alt="return" onClick={handleReturnClick} />
                        <span id='foodDetail-title'>리뷰 작성</span>
                        <span id='complete' onClick={handleCompleteClick}>완료</span>
                    </div>
                </div>
            </div>
            <div className="reviewStarCon2">
                <Rating
                    name={`reviewStarW`}
                    value={rating} 
                    precision={0.5}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                    icon={<img src={reviewStar} alt="review star" style={{ width: '45px', height: '40px' }} />}
                    emptyIcon={<img src={emptyStar} alt="empty star" style={{ width: '45px', height: '40px' }} />}
                />
            </div>
            <p id="reviewQ">주문한 메뉴가 어떠셨나요?</p>
            <hr id="reviewLine" />
            <div className="inputContainer">
                <div className="reviewImg2" onClick={() => document.getElementById('imageInput').click()}>
                    {imagePreview ? (
                        <img id="reviewImg2" src={imagePreview} alt="미리보기" />
                    ) : (
                        <img id="reviewIcon" src={imgInput} alt="이미지 업로드 아이콘" />
                    )}
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>

                <div className="reviewWcon">
                    <textarea
                        className="reviewWcon2"
                        placeholder="솔직한 리뷰를 남겨주세요." 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                    />
                </div>
            </div>
            {error && <p className="error">{error}</p>} 
        </div>
    );
};

export default ReviewWrite;
