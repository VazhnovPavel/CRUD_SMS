import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState('')
    const [time, setTime] = useState('')
    const [phone, setPhone] = useState('')
    const [isActive, setIsActive] = useState('')
    const [sms, setSms] = useState('')

    const [editID, setEditId] = useState('');
    const [editName, setEditName] = useState('')
    const [editTime, setEditTime] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editIsActive, setEditIsActive] = useState('')
    const [editSms, setEditSms] = useState('')



    const [data, setData] = useState([]);
    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get('http://localhost:5145/api/User')
            .then((result) => {
                setData(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`http://localhost:5145/api/User/${id}`)
            .then((result) => {
                setEditName(result.data.name);
                setEditTime(result.data.time)
                setEditPhone(result.data.phone);
                setEditSms(result.data.sms)
                setEditId(id);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleDelete = (id) => {
        if (window.confirm("Подтвердите удаление") == true) {
            axios.delete(`http://localhost:5145/api/User/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('User has been deleted');
                        //обновляем базу данных
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error(error);
                })
        }
    }

    const handleUpdate = () => {
        const url = `http://localhost:5145/api/User/${editID}`
        const statuses = ["Доставлено", "Отправлено", "Ошибка отправки"];
        const randomIndex = Math.floor(Math.random() * statuses.length);
        const editIsActive = statuses[randomIndex];
        const editTime = new Date();

        const data = {
            "id": editID,
            "name": editName,
            "time": editTime,
            "phone": editPhone,
            "isActive": editIsActive,
            "sms": editSms
        }
        if (!editPhone || !editSms) {
            toast.error("Телефон и текст СМС не должны быть пустыми");
            return;
        }
        axios.put(url, data)
            .then((result) => {
                //закрыть pop-up
                handleClose();
                getData();
                clear();
                toast.success('User has been updated');
            }).catch((error) => {
                toast.error(error);
            })
    }


    const handleSave = () => {
        const url = 'http://localhost:5145/api/User';
        const statuses = ["Доставлено", "Отправлено", "Ошибка отправки"];
        const randomIndex = Math.floor(Math.random() * statuses.length);
        const isActive = statuses[randomIndex];
        const time = new Date();
        const data = {
            "name": name,
            "time": time,
            "phone": phone,
            "sms": sms,
            "isActive": isActive
        };

        if (!phone || !sms) {
            toast.error("Телефон и текст СМС не должны быть пустыми");
            return;
        }

        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('User has been added');
            }).catch((error) => {
                toast.error(error);
            });
    };



    const clear = () => {
        setName('');
        setTime('');
        setPhone('');
        setIsActive('');
        setSms('');
        setEditName('');
        setEditTime('');
        setEditPhone('');
        setEditIsActive('');
        setEditId('');
        setEditSms('')
    }




    return (
        <Fragment>
            <ToastContainer />
            <Container>
                <br />
                <br />
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Имя отправителя"
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Номер получателя"
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Текст СМС"
                            value={sms} onChange={(e) => setSms(e.target.value)}
                        />
                    </Col>

                    <Col>
                        <buttom className="btn btn-primary" onClick={() => handleSave()}>Отправить СМС</buttom>
                    </Col>
                </Row>
            </Container>

            <br></br>

            <Table striped bordered hover>
                <thead>
                    <br />
                    <br />
                    <tr>
                        <th>#</th>
                        <th>Время и дата отправки</th>
                        <th>Номер получателя</th>
                        <th>Текст СМС</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <tr>{index + 1}</tr>
                                        <td>{new Intl.DateTimeFormat('default', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric'
                                        }).format(new Date(item.time))}</td>

                                        <td>{item.phone}</td>
                                        <td>{item.sms}</td>
                                        <td>{item.isActive}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>
                                                Изменить</button> &nbsp;
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                                Удалить</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            'Loading...'
                    }


                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify / Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" className="form-control" placeholder="Имя отправителя"
                                value={editName} onChange={(e) => setEditName(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input type="text" className="form-control" placeholder="Номер получателя"
                                value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <input type="text" className="form-control" placeholder="Текст"
                                value={editSms} onChange={(e) => setEditSms(e.target.value)}
                            />
                        </Col>


                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )

}


export default CRUD;