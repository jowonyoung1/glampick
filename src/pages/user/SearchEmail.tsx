import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  postCheckSms,
  postSearchEmail,
  postSearchSendSms,
} from "../../apis/userapi";
import AlertModal from "../../components/common/AlertModal";
import { MainButton } from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import useModal from "../../hooks/UseModal";
import { TimerWrap } from "../ceo/CeoInfo";
import { ErrorMessage } from "../ceo/CeoSignup";
import { WrapStyle } from "../mypage/UserInfo";

const SearchEmail = () => {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [authNumber, setAuthNumber] = useState<string>("");
  const phonePattern = /^[0-9]{3}-?[0-9]{3,4}-?[0-9]{4}$/;
  const authNumberPattern = /^[0-9]{6}$/;

  // 핸드폰 인증코드 발송 여부 확인
  const [isSmsSent, setIsSmsSent] = useState(false);
  // 핸드폰 인증을 위한 타이머 변수
  const [phoneValid, setPhoneValid] = useState(true);
  const [authNumberValid, setAuthNumberValid] = useState(true);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [phoneTimerId, setPhoneTimerId] = useState<NodeJS.Timer | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isAuthNumberVerified, setIsAuthNumberVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Alert 모달 관련 상태와 함수
  const { openModal, closeModal, isModalOpen, checkAction, modalMessage } =
    useModal();

  // 핸드폰 인증시 처리할 함수
  const handleSmsSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (!userPhone) {
      openModal({
        message: "휴대폰 번호를 입력해주세요.",
      });
      return;
    }
    // setLoading(true);
    const result = await postSearchSendSms({ userPhone });
    // console.log(result.data);
    if (result.data.code === "SU") {
      openModal({
        message: "인증코드가 발송되었습니다. \n 문자메세지를 확인해주세요",
      });
      // Sms 발송 성공
      setIsSmsSent(true);
      setPhoneTimer(299);
    } else if (result.data.code === "IPH") {
      openModal({
        message: "전화번호 형식이 올바르지 않습니다.",
      });
    } else if (result.data.code === "NU") {
      openModal({
        message: "존재하지 않는 유저입니다.",
      });
    } else {
      openModal({
        message: "발송 실패하였습니다. 다시 시도해주세요",
      });
    }
    // setLoading(false);
  };

  // 핸드폰 인증코드 처리할 함수
  const handleAuthNumberSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    // 인증코드가 빈 값인지 확인
    if (!authNumber) {
      openModal({
        message: "인증코드를 입력해주세요.",
      });
      return; // 빈 값일 경우 서버 요청을 보내지 않도록 리턴
    }
    try {
      const result = await postCheckSms({ userPhone, authNumber });
      // console.log(result);
      if (result.data.code === "SU") {
        setIsPhoneVerified(true);
        setIsAuthNumberVerified(true);
        openModal({
          message: "인증이 완료되었습니다.",
        });
        setIsSmsSent(false);
        setPhoneTimer(0);
        if (phoneTimerId) {
          // 타이머 중지
          clearInterval(phoneTimerId);
          setPhoneTimerId(null);
        }
      } else if (result.data.code === "IC") {
        openModal({
          message: "인증코드가 올바르지 않습니다.",
        });
      } else if (result.data.code === "EF") {
        openModal({
          message: "인증시간이 만료되었습니다. \n 인증코드를 다시 발송해주세요",
        });
      } else {
        openModal({
          message: "인증에 실패하였습니다. \n 다시 시도해주세요",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.data.code === "NU") {
          openModal({ message: error.response?.data.message });
        }
        if (error.response?.data.code === "IC") {
          openModal({ message: error.response?.data.message });
        }
      } else {
        openModal({ message: "인증에 실패하였습니다. \n 다시 시도해주세요" });
      }
    }
  };

  //이름 입력 필드 변경 처리
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  // 핸드폰번호 수정 함수
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPhone(e.target.value);
    setPhoneValid(phonePattern.test(e.target.value));
  };

  // 핸드폰 번호 표시 형식
  const formatPhone = (phoneNumber: string) => {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  };

  // 핸드폰 타이머 포맷 함수 (분:초 형식으로 표시)
  const formatPhoneTimer = () => {
    const minutes = Math.floor(phoneTimer / 60);
    const seconds = phoneTimer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // 핸드폰 인증 타이머 초기화 및 정리
  useEffect(() => {
    if (phoneTimer > 0 && !phoneTimerId) {
      const id = setInterval(() => {
        setPhoneTimer(prevPhoneTimer => prevPhoneTimer - 1);
      }, 1000); // 1000밀리초 (1초)마다 실행
      setPhoneTimerId(id);
    } else if (phoneTimer === 0 && phoneTimerId) {
      clearInterval(phoneTimerId);
      setPhoneTimerId(null);
    }
    return () => {
      if (phoneTimerId) {
        clearInterval(phoneTimerId);
        setPhoneTimerId(null);
      }
    };
  }, [phoneTimer, phoneTimerId]);

  // 폼 제출 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 이름이 입력되었는지 확인
    if (!userName) {
      openModal({ message: "이름을 입력해주세요" });
      return;
    }
    if (!userPhone) {
      openModal({ message: "휴대폰 번호를 입력해주세요" });
      return;
    }
    // 핸드폰 인증했는지 확인
    if (!isPhoneVerified || !isAuthNumberVerified) {
      openModal({ message: "휴대폰 인증을 완료해주세요." });
      return;
    }
    // 핸드폰 인증코드 완료되었는지 확인
    try {
      const result = await postSearchEmail({ userName, userPhone });
      // console.log(result);
      if (result && result.data.code === "SU") {
        openModal({
          message: `입력하신 정보로 가입된 이메일은 \n ${result.data.userEmail} 입니다.`,
          onCheck: () => {
            navigate("/login"); // 확인 버튼 클릭 시 로그인 페이지로 이동
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WrapStyle>
      {loading && <Loading />}
      <div className="inner">
        <div className="search">이메일 찾기</div>
        <div className="container">
          <div className="wrap">
            <form
              className="userInfo-form"
              onSubmit={e => {
                handleSubmit(e);
              }}
            >
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  className="name-input"
                  value={userName}
                  style={{ backgroundColor: "#fff" }}
                  onChange={handleNameChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cellphone">휴대폰</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="cellphone"
                    className="phone-input"
                    placeholder="휴대폰번호를 정확히 입력해주세요"
                    value={userPhone}
                    onChange={e => {
                      handlePhoneChange(e);
                      setPhoneValid(phonePattern.test(e.target.value));
                    }}
                  />
                  <div className="form-button">
                    <div className="auth-number-btn">
                      <MainButton
                        label="인증번호 발송"
                        onClick={e => {
                          handleSmsSubmit(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
                {!phoneValid && (
                  <ErrorMessage>핸드폰 번호를 바르게 기재해주세요</ErrorMessage>
                )}
              </div>
              {isSmsSent && (
                <div className="form-group">
                  <label htmlFor="auth-number">인증번호</label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="auth-number"
                      maxLength={6}
                      pattern="\d{6}"
                      placeholder="인증번호를 입력해주세요"
                      value={authNumber}
                      onChange={e => {
                        setAuthNumber(e.target.value);
                        setAuthNumberValid(
                          authNumberPattern.test(e.target.value),
                        );
                      }}
                    />
                    <div className="form-button">
                      <div className="auth-number-btn">
                        <MainButton
                          label="확인"
                          onClick={e => {
                            handleAuthNumberSubmit(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* 타이머 */}
              {isSmsSent && phoneTimer > 0 && (
                <TimerWrap>
                  <p className="timer">남은 시간: {formatPhoneTimer()}</p>
                </TimerWrap>
              )}
              {isSmsSent && phoneTimer === 0 && (
                <TimerWrap>
                  <p className="time-over">
                    인증 시간이 만료되었습니다. 다시 발송해주세요.
                  </p>
                </TimerWrap>
              )}
              <div className="modify-btn">
                <MainButton label="확인" />
                {/* 확인버튼 클릭시 로그인 페이지로 이동 */}
              </div>
            </form>
            <AlertModal
              isOpen={isModalOpen}
              onClose={closeModal}
              message={modalMessage}
            />
          </div>
        </div>
      </div>
    </WrapStyle>
  );
};

export default SearchEmail;
