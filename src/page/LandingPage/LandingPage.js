import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import { Spinner } from "react-bootstrap";
import { loginWithToken } from "../../features/user/userSlice";

const LandingPage = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.product.productList);
  const loading = useSelector((state) => state.product.loading); // loading 상태 가져오기
  const [query] = useSearchParams();
  const name = query.get("name");

  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);

  return (
    <Container>
      <Row>
        {loading ? ( // 로딩 상태에 따라 로딩 스피너 표시
          <Col className="text-align-center">
            <Spinner animation="border" />
            <h5>Loading...</h5>
          </Col>
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
    </Container>
  );
};

export default LandingPage;
