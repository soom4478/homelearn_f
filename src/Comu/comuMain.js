import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { displayInfo } from './displayImfo';
import { TeamNum } from './team_num';
import "./comuMain.css";
import heartIcon from "../image/heartIcon.png";
import commentIcon from "../image/commentIcon.png";
import comuBtn from "../image/comuBtn.png";
import axios from 'axios';
import { UserContext } from '../UserContext';

const apikey = process.env.REACT_APP_API_KEY;

const ComuMain = () => {
    const { team_id } = useContext(UserContext);
    const [selectedIndex, setSelectedIndex] = useState('전체');
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [displayText, setDisplayText] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 게시물 및 전광판 데이터 로드
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://3.138.127.122:5000/api/post/${apikey}`);
                setPosts(response.data);
                const fetchBillboard = async () => {
                        try {
                            // 1. 로컬 스토리지에서 이미지 불러오기
                            const storedImage = localStorage.getItem('billboardImage');
                            const storedText = localStorage.getItem('billboardText');
                
                            setBackgroundImage(storedImage);
                            setDisplayText(storedText);
                        } catch (error) {
                            setError(error);
                        } finally {
                            setLoading(false); // 항상 로딩 상태를 false로 설정
                        }
                    };
                fetchBillboard();
                
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    const team = TeamNum.find(team => team.team_num === parseInt(team_id, 10));
    const navItems = ['전체', team ? team.team_name : ''];

    const handleItemClick = (item) => {
        setSelectedIndex(item);
    };

    const handleWriteClick = () => {
        let baseballCommunityId = 0;
        if (selectedIndex !== '전체') {
            const team = TeamNum.find(team => team.team_name === selectedIndex);
            if (team) {
                baseballCommunityId = team.team_num;
            }
        }
        navigate(`/community/write`, { state: { baseballCommunityId } });
    };

    const handleDisplqyClick = () => {
        navigate(`/community/display`);
    };

    const handleComuClick = (id) => {
        navigate(`/community/detail`, { state: { id } });
    };

    const calculateTimeDifference = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now - createdDate) / 1000);
        const days = Math.floor(diffInSeconds / (3600 * 24));
        const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        if (days > 0) {
            return `${days}일 전`;
        } else if (hours > 0) {
            return `${hours}시간 전`;
        } else if (minutes > 0) {
            return `${minutes}분 전`;
        } else if (seconds > 0) {
            return `${seconds}초 전`;
        } else {
            return '방금 전';
        }
    };

    const filteredPosts = posts.filter(post => {
        if (selectedIndex === '전체') {
            return post.baseball_community_id === 0;
        } else {
            const team = TeamNum.find(team => team.team_name === selectedIndex);
            return team && post.baseball_community_id === team.team_num;
        }
    }).reverse();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='comuMcon1'>
            <div className="nav-bar">
                {navItems.map((item, index) => (
                    <div
                        id='comuMcon2'
                        key={index}
                        className={`nav-item ${selectedIndex === item ? 'selected' : ''}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <p>{item}</p>
                    </div>
                ))}
            </div>
            <div
                className='displayCon1'
                style={{ 
                    backgroundImage: `url(${backgroundImage || 'https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_lg/f_auto/primary/agg2myrfd0wegikyb5mn'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <button className='displayB'>
                    <p onClick={handleDisplqyClick}>전광판 작성하기</p>
                </button>
                <p className='displayText'>{displayText}</p>
            </div>
            <div className='comuMcon3'>
                {filteredPosts.map((item, index) => (
                    <div className="comuCon3_2" key={index}>
                        <div className="comuCon4_2" onClick={() => handleComuClick(item.id)}>
                            <p id="comuT">{item.title}</p>
                            <p id="comuI">{item.content}</p>
                            <p id="comuB">{calculateTimeDifference(item.createdAt)}</p>
                            <div className="comuCon5">
                                <div className="comuHcon">
                                    <img id="comuH" src={heartIcon} alt="heartIcon" />
                                    <p id="comuHtext">{item.like_num}</p>
                                </div>
                                <div className="comuCcon">
                                    <img id="comuC" src={commentIcon} alt="commentIcon" />
                                    <p id="comuCtext">{item.comments_num}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <img id="comuBtn" src={comuBtn} alt="comuBtn" onClick={handleWriteClick} />
        </div>
    );
};

export default ComuMain;
