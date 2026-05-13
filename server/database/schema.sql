CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'agent', 'admin')),
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tickets(
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'on_hold', 'resolved', 'closed')),
    priority VARCHAR(20) CHECK(priority IN ('low', 'medium', 'high', 'critical')),
    created_by INTEGER REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    ai_suggestion TEXT,
    attachment_key VARCHAR(500),
    sla_deadline TIMESTAMP,
    resolved_at TIMESTAMP ,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    sender_id INTEGER REFERENCES users(id),
    content TEXT,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE ticket_history(
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    changed_by INTEGER REFERENCES users(id),
    field VARCHAR(50),
    old_value VARCHAR(100),
    new_value VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE notifications(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    ticket_id INTEGER REFERENCES tickets(id),
    type VARCHAR(50),
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);


-- indexing

CREATE INDEX idx_ticket_status ON tickets(status);
CREATE INDEX id_ticket_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_messages_ticket_id ON messages(ticket_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

