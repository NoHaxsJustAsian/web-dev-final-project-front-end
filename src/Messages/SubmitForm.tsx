import { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { io } from "socket.io-client";

interface SubmitFormProps {
    chatId: number;  
}

function SubmitForm({ chatId }: SubmitFormProps): JSX.Element {
    const socket = io(); // Consider configuring this socket connection more specifically if needed.
    const [text, setText] = useState<string>("");

    function handleMsgSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        socket.emit('chat message', text);
        setText(''); // Clear input after sending
    }

    return (
        <div className="chat-selected-footer col-lg-12">
            <Form onSubmit={handleMsgSubmit}>
                <Form.Group>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            required
                            value={text}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}>
                        </Form.Control>
                        <Button type="submit" variant="secondary">Send</Button>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    );
}

export default SubmitForm;
