function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 0, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        item => {
            setItems([...items, item]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            //const index = items.findIndex(i => i.id === item.id);
            const index = items.findIndex(i => i.name === item.name);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">Credits list empty! Give people some love!</p>
            )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    money={item.money}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem, onItemUpdate}) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState('');    
    const [newMoney, setNewMoney] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);


    const submitItem = e => {
        e.preventDefault();
        setSubmitting(true);

        fetch(`/items/${name}`, {
            method: 'POST',
            body: JSON.stringify({ name: newItem, money: newMoney }),
            headers: { 'Content-Type': 'application/json' },        
        })
            .then(r => r.json())
            .then(item => {

            onItemUpdate(item);                
            onNewItem(item);
            setNewItem('');
            setNewMoney('')
            setSubmitting(false);
            });

    };

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem, money: newMoney }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setNewItem('');
                setNewMoney('')
                setSubmitting(false);
            });
    };

    const submitUpdatedItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'PUT',
            body: JSON.stringify({ name: newItem, money: newMoney }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onItemUpdate(item);
                setNewItem('');
                setNewMoney('')
                setSubmitting(false);
            });
    };
    

    return (
        <Form onSubmit={submitItem}>
            <InputGroup className="mb-3">
                <Form.Control                   
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="Add Name"                    
                    aria-describedby="basic-addon1"
                />
                <Form.Control
                    value={newMoney}
                    onChange={e => setNewMoney(e.target.value)}
                    type="number"
                    placeholder="Add Credit"
                    aria-describedby="basic-addon1"
                />

                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length}
                        className={submitting ? 'disabled' : ''}
                >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>                
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const updateItem = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                money: item.money,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const updateItemByName = () => {
        fetch(`/items/${item.name}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                money: item.money,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid className={`item`}>
            <Row>
                <Col xs={10} className="name">
                    {item.name}
                </Col>
                <Col xs={10} className="money">
                    {item.money}
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
