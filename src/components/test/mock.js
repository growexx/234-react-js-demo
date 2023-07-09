import { DeleteForever } from '@mui/icons-material';

export const headerWithAuth = {
  tabs: ['Blogs', 'Add Blog', 'Logout']
};

export const publicWithoutAuth = {
  name: 'Welcome to My First React App!',
  buttonName: 'User Login'
};

export const popup = {
  buttonName: 'Discard',
  buttonColor: 'danger',
  buttonIcon: <DeleteForever />,
  note: 'Are you sure you want to discard this blog?'
};
