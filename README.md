<<<<<<< HEAD
# Sistema de agendamentos para barbearias
Este projeto consiste em um sistema que resolve a dor de barbearias ao realizar agendamentos sem precisar de um atendente.

<div align="center">
  <img width="300" alt="Captura de Tela 2024-08-22 às 23 33 42" src="https://github.com/user-attachments/assets/5fefc0e1-7d8f-4c49-8790-14e62ec9671e">
  <img width="300" alt="Captura de Tela 2024-08-22 às 23 32 50" src="https://github.com/user-attachments/assets/f222c17f-c883-40dd-a2ff-4791a2887dd8">
  <img width="300" alt="Captura de Tela 2024-08-22 às 23 31 35" src="https://github.com/user-attachments/assets/d9db9113-122a-4a47-85cd-6d89d439f9c9">
</div>


## Funcionalidades

### Usuário - cliente
- Realizar o cadastro e efetuar login de forma segura no sistema
- Agendar horário com o barbeiro desejado e escolher o serviço
- Visualizar todos seu agendamentos
- Cancelar agendamentos com pelo menos 2 horas de antecedência
- Fazer *log-off*

### Usuário - admin
- Efetuar login seguro no sistema com um usuário privilegiado
- Visualizar todos os agendamentos de cada barbeiro em um período de até 15 dias
- Cadastrar novos barbeiros e suas respectivas especialidades
- Fazer *log-off*

## Como Usar
- Pré-requisitos: <br/>
Para executar este projeto, é necessário ter um ambiente básico que rode uma aplicação Next.js e ter o PostgreSQL instalado. <br/>
As variáveis de ambiente já estão carregadas no arquivo .env que se encontra neste repositório (já que este projeto não possui fins comerciais).

**Clonando repositório**

```
$ git clone https://github.com/felipeJJ/e-commerce-admin.git

$ cd click_beard_jorge_felipe
```

**Instalando dependências**

```
$ yarn install
```

_ou_

```
$ npm install
```

### Configurando o banco de dados

Configure um servidor PostgreSQL para rodar o banco de dados. Caso queira manter a variável de ambiente DATABASE_URL, crie um banco com o nome "barbershop" e defina a senha como "123456". <br/>
Se preferir outra configuração, basta alterar a variável de ambiente DATABASE_URL de acordo com suas preferências.

**Populando o banco de dados**

Tabela de usuários:
```
CREATE TABLE users (
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'client')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela barbeiros:
```
CREATE TABLE barbers (
    barber_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    hired_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela especialidades:
```
CREATE TABLE specialties (
    specialty_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela barbeiros-especialidades:
```
CREATE TABLE barber_specialties (
    barber_specialty_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    barber_id UUID REFERENCES barbers(barber_id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(specialty_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela agendamentos:
```
CREATE TABLE appointments (
    appointment_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    barber_id UUID REFERENCES barbers(barber_id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(specialty_id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    status VARCHAR(50) DEFAULT 'agendado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Diagrama entidade-relacionamento:**
```
+----------------+          +-----------------+           +---------------------+
|   Users        |          |   Barbers       |           |   Specialties       |
|----------------|          |-----------------|           |---------------------|
| user_id (PK)   |<--+      | barber_id (PK)  |      +--> | specialty_id (PK)   |
| name           |   |      | name            |      |    | name                |
| email          |   |      | age             |      |    | description         |
| password_hash  |   |      | hired_date      |      |    | created_at          |
| role           |   |      | created_at      |      |    +---------------------+
| created_at     |   |      +-----------------+      |
+----------------+   |                             +------+
                     |                             |
                     |                             |
                +--------------------+      +-------------------------+
                | Appointments       |      | Barber_Specialties      |
                |--------------------|      |-------------------------|
                | appointment_id (PK)|      | barber_specialty_id (PK)|
                | user_id (FK)       |      | barber_id (FK)          |
                | barber_id (FK)     |      | specialty_id (FK)       |
                | specialty_id (FK)  |      | created_at              |
                | appointment_date   |      +-------------------------+
                | appointment_time   |
                | duration_minutes   |
                | status             |
                | created_at         |
                +--------------------+
```


## Rodando
Com todas as dependências devidamente instaladas, ambiente de desenvolvimento e bando de dados confirmado:

```
$ npm run dev
```

# Tecnologias Utilizadas
- Next JS (React)
- Type script
- PostgreSQL
- Node
=======
# [Sistema de agendamentos para barbearias](https://click-beard-jorge-felipe.vercel.app/)

Este projeto consiste em um sistema que resolve a dor de barbearias ao realizar agendamentos sem precisar de um atendente.

<div align="center">
  <img width="300" alt="Captura de Tela 2024-08-22 às 23 33 42" src="https://github.com/user-attachments/assets/5fefc0e1-7d8f-4c49-8790-14e62ec9671e">
  <img width="300" alt="Captura de Tela 2024-08-22 às 23 32 50" src="https://github.com/user-attachments/assets/f222c17f-c883-40dd-a2ff-4791a2887dd8">
  <img width="300" alt="Captura de Tela 2024-08-22 às 23 31 35" src="https://github.com/user-attachments/assets/d9db9113-122a-4a47-85cd-6d89d439f9c9">
</div>


## Funcionalidades

### Usuário - cliente
- Realizar o cadastro e efetuar login de forma segura no sistema
- Agendar horário com o barbeiro desejado e escolher o serviço
- Visualizar todos seu agendamentos
- Cancelar agendamentos com pelo menos 2 horas de antecedência
- Fazer *log-off*

### Usuário - admin
- Efetuar login seguro no sistema com um usuário privilegiado
- Visualizar todos os agendamentos de cada barbeiro em um período de até 15 dias
- Cadastrar novos barbeiros e suas respectivas especialidades
- Fazer *log-off*

## Como Usar
- Pré-requisitos: <br/>
Para executar este projeto, é necessário ter um ambiente básico que rode uma aplicação Next.js e ter o PostgreSQL instalado. <br/>
As variáveis de ambiente já estão carregadas no arquivo .env que se encontra neste repositório (já que este projeto não possui fins comerciais).

**Clonando repositório**

```
$ git clone https://github.com/felipeJJ/e-commerce-admin.git

$ cd click_beard_jorge_felipe
```

**Instalando dependências**

```
$ yarn install
```

_ou_

```
$ npm install
```

### Configurando o banco de dados

Configure um servidor PostgreSQL para rodar o banco de dados. Caso queira manter a variável de ambiente DATABASE_URL, crie um banco com o nome "barbershop" e defina a senha como "123456". <br/>
Se preferir outra configuração, basta alterar a variável de ambiente DATABASE_URL de acordo com suas preferências.

**Populando o banco de dados**

Tabela de usuários:
```
CREATE TABLE users (
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'client')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela barbeiros:
```
CREATE TABLE barbers (
    barber_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    hired_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela especialidades:
```
CREATE TABLE specialties (
    specialty_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela barbeiros-especialidades:
```
CREATE TABLE barber_specialties (
    barber_specialty_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    barber_id UUID REFERENCES barbers(barber_id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(specialty_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tabela agendamentos:
```
CREATE TABLE appointments (
    appointment_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    barber_id UUID REFERENCES barbers(barber_id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(specialty_id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    status VARCHAR(50) DEFAULT 'agendado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Diagrama entidade-relacionamento:**
```
+----------------+          +-----------------+           +---------------------+
|   Users        |          |   Barbers       |           |   Specialties       |
|----------------|          |-----------------|           |---------------------|
| user_id (PK)   |<--+      | barber_id (PK)  |      +--> | specialty_id (PK)   |
| name           |   |      | name            |      |    | name                |
| email          |   |      | age             |      |    | description         |
| password_hash  |   |      | hired_date      |      |    | created_at          |
| role           |   |      | created_at      |      |    +---------------------+
| created_at     |   |      +-----------------+      |
+----------------+   |                             +------+
                     |                             |
                     |                             |
                +--------------------+      +-------------------------+
                | Appointments       |      | Barber_Specialties      |
                |--------------------|      |-------------------------|
                | appointment_id (PK)|      | barber_specialty_id (PK)|
                | user_id (FK)       |      | barber_id (FK)          |
                | barber_id (FK)     |      | specialty_id (FK)       |
                | specialty_id (FK)  |      | created_at              |
                | appointment_date   |      +-------------------------+
                | appointment_time   |
                | duration_minutes   |
                | status             |
                | created_at         |
                +--------------------+
```


## Rodando
Com todas as dependências devidamente instaladas, ambiente de desenvolvimento e bando de dados confirmado:

```
$ npm run dev
```

# Tecnologias Utilizadas
- Next JS (React)
- Type script
- PostgreSQL
- Node
>>>>>>> 4714dd5 (feat: add readme)
