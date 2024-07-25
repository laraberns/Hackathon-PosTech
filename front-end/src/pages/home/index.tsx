import * as React from 'react';
import Table from '../../components/Table';
import Nav from '@/components/Nav';
import { Box, GlobalStyles } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import logoImg from '../../assets/logo.png';
import { ONG } from '@/components/Modal';
import { Container, Search, StyledInput, Title } from './styles';

const API_URL = `${process.env.BD_API}/ongs/allongs`;

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
        return <p>Verificando autenticação...</p>;
    }

    if (!authenticated) {
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
                    <Image src={logoImg} alt="Image of logo" width={150} />
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

