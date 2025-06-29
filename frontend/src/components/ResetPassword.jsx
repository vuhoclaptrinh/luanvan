import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import axios from "axios"
import { Lock, CheckCircle } from "lucide-react"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [matKhau, setMatKhau] = useState("")
  const [xacNhan, setXacNhan] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  useEffect(() => {
    if (!token || !email) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ.")
    }
  }, [token, email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (matKhau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.")
      setLoading(false)
      return
    }

    if (matKhau !== xacNhan) {
      setError("Mật khẩu xác nhận không khớp.")
      setLoading(false)
      return
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/reset-password", {
        email,
        token,
        new_password: matKhau,
        new_password_confirmation: xacNhan, // 👈 thêm trường này
      })

      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000) // Tự động chuyển sau 3s
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Đã xảy ra lỗi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <h4 className="text-center mb-3">Đặt lại mật khẩu</h4>

            {error && <Alert variant="danger">{error}</Alert>}
            {success ? (
              <Alert variant="success">
                <CheckCircle className="me-2" />
                Mật khẩu đã được đặt lại thành công! Đang chuyển hướng...
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={xacNhan}
                    onChange={(e) => setXacNhan(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ResetPassword
