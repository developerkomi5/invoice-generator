import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ✅ Proper helper function (not a component)
const generateInvoice = () => {
  const invoice = document.querySelector("#invoiceCapture");
  if (!invoice) return;

  html2canvas(invoice).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice-001.pdf');
  });
};

class InvoiceModal extends React.Component {
  render() {
    const {
      showModal,
      closeModal,
      info,
      items,
      currency,
      subTotal,
      taxAmmount,
      discountAmmount,
      total,
    } = this.props;

    return (
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div id="invoiceCapture">
          <div className="d-flex justify-content-between bg-light p-4">
            <div>
              <h4 className="fw-bold">{info.billFrom || 'John Uberbacher'}</h4>
              <h6 className="text-secondary">
                Invoice #: {info.invoiceNumber || ''}
              </h6>
            </div>
            <div className="text-end">
              <h6>Amount Due:</h6>
              <h5 className="text-secondary">
                {currency} {total}
              </h5>
            </div>
          </div>

          <div className="p-4">
            <Row className="mb-4">
              <Col md={4}>
                <div className="fw-bold">Billed To:</div>
                <div>{info.billTo}</div>
                <div>{info.billToAddress}</div>
                <div>{info.billToEmail}</div>
              </Col>

              <Col md={4}>
                <div className="fw-bold">Billed From:</div>
                <div>{info.billFrom}</div>
                <div>{info.billFromAddress}</div>
                <div>{info.billFromEmail}</div>
              </Col>

              <Col md={4}>
                <div className="fw-bold">Date Of Issue:</div>
                <div>{info.dateOfIssue}</div>
              </Col>
            </Row>

            <Table>
              <thead>
                <tr>
                  <th>QTY</th>
                  <th>DESCRIPTION</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.quantity}</td>
                    <td>{item.name} - {item.description}</td>
                    <td className="text-end">{currency} {item.price}</td>
                    <td className="text-end">
                      {currency} {item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Table>
              <tbody>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold">SUBTOTAL</td>
                  <td>{currency} {subTotal}</td>
                </tr>

                {taxAmmount !== 0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold">TAX</td>
                    <td>{currency} {taxAmmount}</td>
                  </tr>
                )}

                {discountAmmount !== 0 && (
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold">DISCOUNT</td>
                    <td>{currency} {discountAmmount}</td>
                  </tr>
                )}

                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold">TOTAL</td>
                  <td>{currency} {total}</td>
                </tr>
              </tbody>
            </Table>

            {info.notes && (
              <div className="bg-light p-3 rounded">{info.notes}</div>
            )}
          </div>
        </div>

        <div className="px-4 pb-4">
          <Row>
            <Col md={6}>
              <Button className="w-100" onClick={generateInvoice}>
                <BiPaperPlane className="me-2" />
                Send Invoice
              </Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-primary" className="w-100 mt-3 mt-md-0" onClick={generateInvoice}>
                <BiCloudDownload className="me-2" />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default InvoiceModal;
