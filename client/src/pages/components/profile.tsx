import React, { useState } from "react";
import {
    Avatar, Box, Button, Card, CardContent, IconButton, TextField, Typography
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { BACKEND_ENDPOINT } from "../../constants/endpoints";
import { useTheme as useAppTheme } from "../../context/ThemeContext";
import { useTheme as useMuiTheme } from '@mui/material/styles'; // <- MUI hook for palette

interface User {
    email: string;
    name: string;
    username: string;
    bio?: string;
    profile_picture?: string;
    date_joined: string;
}

interface ProfileProps {
    user: User;
    onUpdate: (updatedUser: User, photoFile?: File) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
    const { mode } = useAppTheme();
    const theme = useMuiTheme();

    const [editedUser, setEditedUser] = useState<User>(user);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [photo, setPhoto] = useState<File | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const handleEdit = (field: string) => setEditingField(field);
    const handleCancel = () => setEditingField(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
        setHasChanges(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setEditedUser({ 
                ...editedUser, 
                profile_picture: URL.createObjectURL(file)
            });
            setHasChanges(true);
        }
    };

    const handleSave = () => {
        onUpdate(editedUser, photo || undefined);
        setEditingField(null);
        setHasChanges(false);
        setPhoto(null);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Card sx={{ 
                width: 400, 
                p: 3, 
                textAlign: "center", 
                boxShadow: 3,
                backgroundColor: theme.palette.background.paper,
                transition: 'all 0.3s ease'
            }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar
                        src={editedUser.profile_picture || "https://via.placeholder.com/150"}
                        alt={editedUser.name}
                        sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                    />
                    <IconButton
                        component="label"
                        sx={{ 
                            position: "absolute", 
                            bottom: 0, 
                            right: "30%", 
                            bgcolor: theme.palette.background.default, 
                            color: theme.palette.text.primary, 
                            p: 0.5 
                        }}
                    >
                        <CameraAltIcon fontSize="small" />
                        <input 
                            type="file" 
                            accept="image/*" 
                            hidden 
                            onChange={handlePhotoChange} 
                        />
                    </IconButton>
                </Box>

                <CardContent>
                    {(["name", "username", "bio"] as const).map((field) => (
                        <Box 
                            key={field} 
                            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}
                        >
                            {editingField === field ? (
                                <TextField
                                    fullWidth
                                    name={field}
                                    value={editedUser[field] || ""}
                                    onChange={handleChange}
                                    size="small"
                                    autoFocus
                                />
                            ) : (
                                <Typography 
                                    variant={field === "bio" ? "body2" : "h6"} 
                                    color={theme.palette.text.primary}
                                >
                                    {editedUser[field] || `No ${field} available`}
                                </Typography>
                            )}
                            <IconButton onClick={() => handleEdit(field)} sx={{ color: theme.palette.text.primary }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                    <Typography variant="caption" color="text.secondary">
                        Joined on {new Date(editedUser.date_joined).toDateString()}
                    </Typography>
                </CardContent>

                {hasChanges && (
                    <Button 
                        variant="contained" 
                        onClick={handleSave} 
                        startIcon={<SaveIcon />} 
                        sx={{ 
                            mt: 2,
                            color: theme.palette.primary.contrastText,
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                )}
            </Card>
        </Box>
    );
};

export default Profile;
