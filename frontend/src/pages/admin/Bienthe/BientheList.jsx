import axios from "axios";
import React, { useEffect, useState } from "react";

const BientheList = () => {
  const [bienthe, setBienthe] = useState([]);
  const [dungTich, setDungTich] = useState("");

  const fetchBienthe = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/bienthe");
      setBienthe(res.data.data || []);

      console.log("Dữ liệu biến thể:", res.data.data);
    } catch (error) {
      console.error("Error fetching biến thể:", error);
    }
  };
  const fetchBientheByDungTich = async (dungTich) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/bienthe/dungtich/${dungTich}`
      );
      setBienthe(res.data.data || []);
      console.log("Dữ liệu biến thể theo dung tích:", res.data.data);
    } catch (error) {
      console.error("Error fetching biến thể theo dung tích:", error);
    }
  };

  useEffect(() => {
    if (dungTich === "") {
      fetchBienthe();
    }
    fetchBientheByDungTich(dungTich);
  }, [dungTich]);

  return (
    <div>
      <h1>Danh sách biến thể</h1>
      <select value={dungTich} onChange={(e) => setDungTich(e.target.value)}>
        <option value="">Tất cả</option>
        <option value="100">100ml</option>
        <option value="200">200ml</option>
        <option value="500">500ml</option>
      </select>
      <ul>
        {bienthe.length === 0 ? (
          <li>Không có dữ liệu</li>
        ) : (
          bienthe.map((item) => (
            <li key={item.id}>
              Dung tích: {item.dung_tich}ml – Giá: {item.gia} VNĐ – Tồn kho:{" "}
              {item.so_luong_ton}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BientheList;
