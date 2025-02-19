import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { TodoService, Todo, CreateTodoInput, UpdateTodoInput } from '../services/api';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState<CreateTodoInput>({
    title: '',
    description: '',
  });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await TodoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('加载Todo列表失败:', error);
    }
  };

  const handleCreateTodo = async () => {
    try {
      await TodoService.createTodo(newTodo);
      setNewTodo({ title: '', description: '' });
      await loadTodos();
    } catch (error) {
      console.error('创建Todo失败:', error);
    }
  };

  const handleUpdateTodo = async (todo: Todo, updates: UpdateTodoInput) => {
    try {
      await TodoService.updateTodo(todo.id, updates);
      await loadTodos();
    } catch (error) {
      console.error('更新Todo失败:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await TodoService.deleteTodo(id);
      await loadTodos();
    } catch (error) {
      console.error('删除Todo失败:', error);
    }
  };

  const handleToggleComplete = (todo: Todo) => {
    handleUpdateTodo(todo, { completed: !todo.completed });
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setOpenDialog(true);
  };

  const handleEditSave = async () => {
    if (editingTodo) {
      await handleUpdateTodo(editingTodo, {
        title: editingTodo.title,
        description: editingTodo.description,
      });
      setOpenDialog(false);
      setEditingTodo(null);
    }
  };

  return (
    <Box sx={{
      maxWidth: 800,
      margin: '0 auto',
      padding: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          color: 'primary.main',
          mb: 4
        }}
      >
        待办事项列表
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 6
          }
        }}
      >
        <Box sx={{ display: 'flex', gap: 2.5, flexDirection: 'column' }}>
          <TextField
            label="标题"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <TextField
            label="描述"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleCreateTodo}
            disabled={!newTodo.title}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            添加新待办事项
          </Button>
        </Box>
      </Paper>

      <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              mb: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: 4
              },
              p: { xs: 1.5, sm: 2 }
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
              sx={{
                '&.Mui-checked': {
                  color: 'primary.main'
                }
              }}
            />
            <ListItemText
              primary={todo.title}
              secondary={todo.description}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary',
                  transition: 'all 0.2s ease'
                },
                '& .MuiListItemText-secondary': {
                  mt: 0.5
                }
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleEditClick(todo)}
                sx={{
                  mr: 1,
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDeleteTodo(todo.id)}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.lighter'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
            width: '100%',
            maxWidth: 500
          }
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            pt: 2.5,
            px: 3,
            typography: 'h5',
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          编辑待办事项
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="标题"
              value={editingTodo?.title || ''}
              onChange={(e) =>
                setEditingTodo(
                  editingTodo
                    ? { ...editingTodo, title: e.target.value }
                    : null
                )
              }
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <TextField
              label="描述"
              value={editingTodo?.description || ''}
              onChange={(e) =>
                setEditingTodo(
                  editingTodo
                    ? { ...editingTodo, description: e.target.value }
                    : null
                )
              }
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            取消
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList;