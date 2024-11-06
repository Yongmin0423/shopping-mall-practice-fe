import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({ header, data, openEditForm }) => {
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title) => (
              <th key={title}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              console.log("item.shipTo:", item.shipTo); // shipTo 값 확인
              console.log("item", item);

              // shipTo를 JSON.parse로 파싱
              let shipTo = {};
              try {
                shipTo = JSON.parse(item.shipTo);
              } catch (error) {
                console.error("shipTo JSON 파싱 오류:", error);
              }

              return (
                <tr onClick={() => openEditForm(item)} key={index}>
                  <th>{index}</th>
                  <th>{item.orderNum}</th>
                  <th>{item.createdAt.slice(0, 10)}</th>
                  <th>{item.userId.email}</th>
                  {item.items.length > 0 ? (
                    <th>
                      {item.items[0].productId.name}
                      {item.items.length > 1 &&
                        ` 외 ${item.items.length - 1}개`}
                    </th>
                  ) : (
                    <th></th>
                  )}

                  {/* shipTo 필드 확인 */}
                  <th>
                    {(shipTo.address || "주소 없음") +
                      " " +
                      (shipTo.city || "도시 없음")}
                  </th>

                  <th>{currencyFormat(item.totalPrice)}</th>
                  <th>
                    <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                  </th>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={header.length}>No Data to show</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
