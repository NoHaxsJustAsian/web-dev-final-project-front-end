import { useState, useEffect } from 'react';
import { getUserConversations, sendMessage } from '../services/messagesData';
import { Container, Row, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Conversation } from '../services/types';

function Messages(chatId: number) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isSelected, setIsSelected] = useState(false);
    const [selected, setSelected] = useState<Conversation>({
        chats: {
            _id: 0,
            seller: {
                _id: 0,
                username: "",
            },
            buyer: {
                _id: 0,
                username: "",
            },
            conversation: []
        },
        isBuyer: undefined,
        myId: 0
    });
    const [message, setMessage] = useState<string>("");
    const [alert, setAlert] = useState<any>(null);
    const [alertShow, setAlertShow] = useState<any>(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const conversations = await getUserConversations();
                if (conversations) {
                    setConversations(conversations);
                }
            } catch (err) {
                console.log('Error fetching conversations');
            }
        };
    
        fetchConversations();
    
        // You may need to ensure that this part runs only after `conversations` is set
        if (isSelected) {
            const selectedConversation = conversations.find(x => x.chats._id === chatId);
            if (selectedConversation) {
                setSelected(selectedConversation);
            }
        }
    }, [isSelected, chatId, setSelected, conversations]);

    function handleMsgSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        sendMessage(chatId, message)
            .then((res) => {
                setAlert("Message sent.")
                setAlertShow(true);
                setMessage("");
                setSelected(selected);
                //selected.chats.conversation.push({ message: message, senderId: res.sender });
                setTimeout(() => {
                    setAlert(null);
                    setAlertShow(false);
                }, 1000);
            })
            .catch(err => {
                console.log(err);
                setAlert("Failed to send message.");
                setAlertShow(true);
                setTimeout(() => {
                    setAlert(null);
                    setAlertShow(false);
                }, 1000);
            });
    }


    return (
        <Container>
            <Row>
                <aside className="col-lg-4 col-md-4">
                    <h3>Conversations</h3>
                    {conversations.length >= 1 ?
                        <>
                            {conversations.map(x =>
                                <div className="chat-connections" key={x.chats._id}>
                                    <Link onClick={() => setIsSelected(true)} to={`/messages/${x.chats._id}`}>
                                        {x.isBuyer ?
                                            <><img src={x.chats.seller.avatar} alt="user-avatar" /> <span>{x.chats.seller.name}</span></>
                                            :
                                            <><img src={x.chats.buyer.avatar} alt="user-avatar" /> <span>{x.chats.buyer.name}</span></>
                                        }
                                    </Link>
                                </div>)
                            }
                        </>
                        :
                        <h5>No messages yet</h5>
                    }
                </aside>
                <article className="col-lg-8 col-md-8">
                    {isSelected &&
                        <>
                            <div className="chat-selected-header col-lg-12">
                                {selected.isBuyer ?
                                    <Link to={`/profile/${selected.chats.seller._id}`}>
                                        <img src={selected.chats.seller.avatar} alt="user-avatar" />
                                        <span>{selected.chats.seller.name}</span>
                                    </Link>
                                    :
                                    <Link to={`/profile/${selected.chats.buyer._id}`}>
                                        <img src={selected.chats.buyer.avatar} alt="user-avatar" />
                                        <span>{selected.chats.buyer.name}</span>
                                    </Link>
                                }
                            </div>
                            {alertShow &&
                                <Alert variant="success" onClose={() => setAlertShow(false)} dismissible>
                                    <p>
                                        {alert}
                                    </p>
                                </Alert>
                            }
                            <div className="chat-selected-body col-lg-12">
                                {selected.chats.conversation.map(x =>
                                    <div className={selected.myId === x.senderId ? 'me' : "not-me"} key={x._id}>
                                        <span className="message">{x.message}</span>
                                    </div>
                                )}
                            </div>
                            <div className="chat-selected-footer col-lg-12">
                                <Form onSubmit={handleMsgSubmit}>
                                    <Form.Group>
                                        <InputGroup>
                                            <Form.Control
                                                as="textarea"
                                                required
                                                value={message as string}
                                                onChange={(e) => setMessage(e.target.value)}>
                                            </Form.Control>
                                            <Button type="submit" variant="secondary">Sent</Button>                                      
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                            </div>
                        </>
                    }
                </article>
            </Row>
        </Container>
    )
}

export default Messages;