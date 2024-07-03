import React from "react";
import "../../styles/common.css";
import "../../styles/reset.css";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-contents">
            <ul className="footer-contents-title">
              고객센터
              <li>오전 9시 ~ 오후 6시</li>
            </ul>
            <ul className="footer-contents-title">
              회사
              <li>회사 소개</li>
            </ul>
            <ul className="footer-contents-title">
              서비스
              <li>공지사항</li>
              <li>자주 묻는 질문</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <ul className="footer-bottom-list">
            <li>이용약관</li>
            <li>
              <p>개인정보처리방침</p>
            </li>
            <li>소비자 분쟁해결 기준</li>
            <li>콘텐츠산업진흥법에 의한 표시</li>
          </ul>
          <div className="footer-bottom-detail">
            <p>
              (주) 글램픽 주식회사
              <br />
              주소 : 대구광역시 중구 중앙대로 394 제일빌딩 5F | 대표팀 : 4조 |
              사업자등록번호 : 110-11-11111
              <br />
              전자우편주소 : mj17428@glampick.com | 통신판매번호 :
              2024-대구중구-00000 | 대표번호 : 053-572-1005
              <br />
              (주) 글램픽 주식회사는 통신판매중개자로서 통신판매의 당사자가
              아니며, 상품의 예약, 이용 및 환불 등과 관련한 의무와 책임은 각
              판매자에게 있습니다.
              <br />
              <br />
              Copyright GLAMPICK COMPANY Corp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
