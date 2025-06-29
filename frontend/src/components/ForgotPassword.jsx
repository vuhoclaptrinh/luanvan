import { useState } from "react"
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap"
import axios from "axios"
import { Mail, Send } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [resetLink, setResetLink] = useState("")
  const navigate = useNavigate()

 const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/forgot-password", { email })

    setSent(true)
    setResetLink(res.data.reset_link) // 👈 lấy link từ Laravel API trả về

    toast.success("Link đặt lại mật khẩu đã được tạo!")
  } catch (err) {
    console.error(err)
    setError("Không tìm thấy tài khoản với email này.")
  } finally {
    setLoading(false)
  }
}

  return (
    <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="p-4">
              <h4 className="mb-3 text-center">Quên mật khẩu</h4>

              {/* ✅ Đặt đoạn này ở đây */}
              {sent && resetLink ? (
                <Alert variant="success">
                  <div>✅ Đường dẫn đặt lại mật khẩu:</div>
                  <a href={resetLink} target="_blank" rel="noopener noreferrer">
                    {resetLink}
                  </a>
                </Alert>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email đăng ký"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" disabled={loading} className="w-100">
                    {loading ? "Đang gửi..." : (
                      <>
                        <Send size={16} className="me-2" />
                        Gửi link đặt lại mật khẩu
                      </>
                    )}
                  </Button>
                </Form>
              )}

              <Button variant="link" className="mt-3" onClick={() => navigate("/login")}>
                Quay lại đăng nhập
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
  )
}

export default ForgotPassword
