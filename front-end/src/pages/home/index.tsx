import * as React from 'react';
import Table from '../../components/Table';
import { styled } from '@mui/system';
import Nav from '@/components/Nav';
import { Box, GlobalStyles } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import logoImg from '../../assets/logo.png';

const API_URL = `${process.env.BD_API}/ongs/allongs`;

export interface ONG {
    id: string;
    name: string;
    description: string;
    city: string;
    state: string;
    area: string;
    contact: string;
}

const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [ongs, setOngs] = React.useState<ONG[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [authenticated, setAuthenticated] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setAuthenticated(false);
                    return;
                }

                console.log(token)

                const response = await axios.get(`${process.env.BD_API}/auth/validate`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setAuthenticated(true);
                    fetchOngs();
                }
            } catch (error) {
                setAuthenticated(false);
            }
        };

        // Função para buscar ONGs se autenticado
        const fetchOngs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get<ONG[]>(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOngs(response.data);
            } catch (err) {
                setError('Erro ao carregar as ONGs.');
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = ongs.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authenticated === null) {
        // Exibe um carregando ou um componente de placeholder enquanto a autenticação é verificada
        return <p>Verificando autenticação...</p>;
    }

    if (!authenticated) {
        // Redireciona ou exibe uma mensagem se não autenticado
        window.location.href = '/login';
        return null;
    }

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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 4 }}>
                    <Image src={logoImg} alt="Workflow" width={200} />
                </Box>
                <Title>ONGS Cadastradas</Title>
                <Search>
                    <StyledInput
                        type="text"
                        placeholder="Pesquisar por nome de ONG..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Search>
                {loading ? (
                    <p>Carregando...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <Table rows={filteredData} />
                )}
            </Container>
        </>
    );
};

export default Home;

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
    marginBottom: '20px',
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
