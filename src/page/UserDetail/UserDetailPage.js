import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { getUserInfo, updateUserInfo } from "../../features/user/userSlice";
import { showToastMessage } from "../../features/common/uiSlice";

const UserDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user.user);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    currentPassword: "", // 기존 비밀번호 필드
    newPassword: "", // 새로운 비밀번호 필드
  });

  useEffect(() => {
    if (!user) {
      dispatch(
        showToastMessage({ message: "로그인이 필요합니다.", status: "error" })
      );
      return navigate("/login");
    }
    dispatch(getUserInfo());
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        email: userInfo.data.email || "",
        name: userInfo.data.name || "",
        currentPassword: "", // 초기화
        newPassword: "", // 초기화
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 서버에 보낼 데이터는 currentPassword와 newPassword
    const formDataToSend = {
      ...formData,
      currentPassword: formData.currentPassword, // 기존 비밀번호
      password: formData.newPassword, // 새로운 비밀번호
    };

    dispatch(updateUserInfo({ data: formDataToSend, navigate })).then(() => {
      dispatch(getUserInfo()); // 업데이트 후 정보 재요청
    });
  };

  if (loading) {
    return (
      <div className="loader-container">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );
  }

  return (
    <Container className="user-detail-card">
      <Row>
        <Col sm={12}>
          <h1>유저 정보</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled // 이메일은 수정 불가능
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>기존 비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                placeholder="기존 비밀번호를 입력하세요"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>새로운 비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                placeholder="새로운 비밀번호를 입력하세요"
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="dark" type="submit" className="update-button">
              정보 업데이트
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetailPage;
