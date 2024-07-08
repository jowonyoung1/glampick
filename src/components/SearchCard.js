import styled from "@emotion/styled";

import { colorSystem, size } from "../styles/color";
import SearchImage from "../images/search-pic1.png";
import React from "react";
import { FaStar } from "react-icons/fa";
import { MainButton } from "./common/Button";
import { Link } from "react-router-dom";

const SearchContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 950px;
  height: 240px;
  padding: 40px 0;
  margin: 40px 0;
  border-top: 1px solid;
  border-color: ${colorSystem.g200};
  :last-child {
    border-bottom: none;
  }
  :first-child {
    border-top: none;
  }
  .search-image {
    max-width: 400px;
    width: 100%;
    height: 240px;
    background: url(${SearchImage}) no-repeat center;
    margin-left: 15px;
  }
  .search-detail {
    width: 550px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 40px 10px 50px;

    .sc-top {
      .sc-name {
        font-size: 22px;
        margin-bottom: 10px;
        font-weight: 600;
      }
      .sc-review {
        display: flex;
        font-size: 15px;
        .sc-review-top {
          display: flex;
          svg {
            margin: 0 5px;
            color: #ffd233;
          }
          .sc-score {
            margin-right: 15px;
          }
        }
        .sc-review-bottom {
          .sc-count {
          }
        }
        ${size.mid} {
          flex-direction: column;
          gap: 5px;
        }
      }
    }
    .sc-bottom {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      .sc-price {
        font-size: 17px;
        font-weight: 500;
      }
    }
  }

  @media all and (max-width: 950px) {
    max-width: 950px;
    width: 100%;

    .search-image {
      min-width: 240px;
      background-size: cover;
      border-radius: 15px;
    }
    .search-detail {
      gap: 30px;
    }
  }
`;

const SearchCard = () => {
  return (
    <SearchContent>
      <div className="search-image"></div>
      <div className="search-detail">
        <div className="sc-top">
          <div className="sc-name">그린 파인트리글램핑&카라반</div>
          <div className="sc-review">
            <div className="sc-review-top">
              <FaStar />
              <div className="sc-score">4.6</div>
            </div>
            <div className="sc-review-bottom">
              <div className="sc-count">1,234 개 리뷰</div>
            </div>
          </div>
        </div>
        <div className="sc-bottom">
          <div className="sc-price">85,000원 ~</div>
          <MainButton label="예약하기">
            <Link to="/glampingdetail" />
          </MainButton>
        </div>
      </div>
    </SearchContent>
  );
};

export default SearchCard;
