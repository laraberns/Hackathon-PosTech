import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { User } from '@/pages/perfil-admin';

interface ManageUsersProps {
    users: User[];
    openUpdateUserDialog: (user: User) => void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ users, openUpdateUserDialog }) => {
    return (
        <Box sx={{ backgroundColor: "#EEEEEE", padding: "20px", borderRadius: "20px" }}>
            <Typography variant="h6">Gerenciamento de Usuários</Typography>
            <List>
                {users.map(user => (
                    <ListItem key={user.userId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid grey', borderRadius: 3, mb: 2, padding: '10px' }}>
                        <ListItemText
                            primary={user.displayName}
                            secondary={`Tipo: ${user.userType}`}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                onClick={() => openUpdateUserDialog(user)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ManageUsers;
