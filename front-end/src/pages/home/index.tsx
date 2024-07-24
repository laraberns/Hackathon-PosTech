import * as React from 'react';
import Table from '../../components/Table';
import { styled } from '@mui/system';
import Nav from '@/components/Nav';
import { GlobalStyles } from '@mui/material';
import { Padding } from '@mui/icons-material';

// MOCK - Depois alterar para chamada da API
const data = [
    { name: 'OllllllllllllllllllNG 1', description: 'Descrikkkkkkkkkkkkkkkkkkkkkkkção 1', city: 'Cidkkkkkkkkkkkade 1', state: 'Estado 1', areaOfExpertise: 'Educação', contact: 'Contato 1' },
    { name: 'ONG 2', description: 'Descrição 2', city: 'Cidade 2', state: 'Estado 2', areaOfExpertise: 'Saúde', contact: 'Contato 2' },
    { name: 'ONG 3', description: 'Descrição 3', city: 'Cidade 3', state: 'Estado 3', areaOfExpertise: 'Tecnologia', contact: 'Contato 3' },
    { name: 'ONG 4', description: 'Descrição 4', city: 'Cidade 4', state: 'Estado 4', areaOfExpertise: 'Meio Ambiente', contact: 'Contato 4' },
    { name: 'ONG 5', description: 'Descrição 5', city: 'Cidade 5', state: 'Estado 5', areaOfExpertise: 'Arte e Cultura', contact: 'Contato 5' },
    { name: 'ONG 6', description: 'Descrição 5', city: 'Cidade 5', state: 'Estado 5', areaOfExpertise: 'Arte e Cultura', contact: 'Contato 5' },
    { name: 'ONG 7', description: 'Descrição 5', city: 'Cidade 5', state: 'Estado 5', areaOfExpertise: 'Arte e Cultura', contact: 'Contato 5' },
    { name: 'ONG 8', description: 'Descrição 5', city: 'Cidade 5', state: 'Estado 5', areaOfExpertise: 'Arte e Cultura', contact: 'Contato 5' },
];

const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <GlobalStyles
                styles={{
                    html: {
                        height: '100%',
                        width: '100%',
                        overflow: 'scroll',
                    },
                    body: {
                        height: '100%',
                        width: '100%',
                        overflow: 'auto',
                        margin: 0,
                        padding: 0,
                        boxSizing: 'border-box',
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    },
                }}
            />

            <Nav />
            <Container>
                <Search>
                    <StyledInput
                        type="text"
                        placeholder="Pesquisar por nome de ONG..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Search>
                <Title>ONGS Cadastradas</Title>
                <Table rows={filteredData} />
            </Container>
        </>
    );
};

export default Home;

const color = {
    1: '#FED8D0',
}

// ESTILOS
const Container = styled('div')({
    alignItems: 'center',
    height: '100%',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
});

const Search = styled('div')({
    width: '100%',
    height: '100%'
});

const StyledInput = styled('input')({
    width: '80%',
    margin: '0 auto',
    display: 'block',
    marginBottom: '50px',
    padding: '10px',
    border: 'solid 1px #B0B8C4',
    borderRadius: '8px',
    outline: 'none',
});

const Title = styled('h1')({
    fontSize: '20px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    textAlign: 'center',
    marginBottom: '20px',
});