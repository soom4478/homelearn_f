import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import './Homeground.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import foodOrderImage from '../image/Pizza.png';

const Homeground = () => {
  const navigate = useNavigate();
  const [homegroundData, setHomegroundData] = useState(null);
  const [searchParams] = useSearchParams(); // 쿼리 파라미터 가져오기
  const teamId = parseInt(searchParams.get('teamId')); // teamId 가져오기

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchHomegroundData = async () => {
      try {
        // 고정된 API URL 사용
        const response = await fetch("http://3.138.127.122:5000/api/homeground/6VVQ0SB-C3X4PJQ-J3DZ587-5FGKYD1"); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // teamId가 같은 데이터만 필터링
        const filteredData = data.filter(item => item.teamId === teamId);
        setHomegroundData(filteredData.length > 0 ? filteredData[0] : null); // 필터링된 데이터가 있으면 첫 번째 항목 설정
      } catch (error) {
        console.error('Error fetching homeground data:', error);
      }
    };

    fetchHomegroundData();
  }, [teamId]);

  return (
    <div className="container2">
      {!homegroundData ? (
        <p>로딩 중...</p> // 데이터가 없을 때 로딩 메시지 표시
      ) : (
        <>
          <div className="header20">
            <button className="back-button" onClick={() => window.history.back()}>
              <ArrowBackIcon style={{ marginBottom:"35px" }} />
            </button>
            <div className="title">{homegroundData.name}</div>
            <div className="line"></div>
            <div className="text-container">
              <LocationOnIcon
                style={{
                  fontSize: '20px',
                  verticalAlign: 'middle',
                  marginRight: '5px',
                  color: '#009788',
                }}
              />
              <p className="content-text">{homegroundData.homeground_location}</p>
              <p className="content-text2">{homegroundData.homeground_station}</p>
            </div>
            <div className="line"></div>
          </div>
          <div className="info-box">
            <div className="info-section">
              <div className='map-container'>
                <p className="label-text">좌석 배치도</p>
                <button
                  className="view-details-button"
                  onClick={() => navigate('/map-detail')}
                >
                  자세히 보기 {'>'}
                </button>
              </div>
            </div>
            <div
              className="stadium-map"
              style={{
                backgroundImage: `url(${homegroundData.homeground_seatingplan_image_url})`,
              }}
            />
            <div className="line"></div>
          </div>

          <div className="parking-box">
            <p className="label-text">주차장</p>
            <div className="info-section">  
              <p className="parking-header">대전문창초등학교 운동장</p>
              <p className="parking-text">운영 시간 <span className="spacing">주말 및 공휴일 경기 기간 경기 시작 1시간 전 ~</span></p>
              <p className="parking-text">주차 비용<span className="spacing"> 무료</span></p>
            </div>
          </div>

          <button className="order-box">
            <p className="order-text">지금 있는 구장에서<br/>먹거리 주문하기</p>    
            <img src={foodOrderImage} alt="Food Order" className="order-image" />
          </button>
        </>
      )}
    </div>
  );
};

export default Homeground;
