import { UserForm } from '../../../widgets/users/form/UserForm.tsx';
import { CreateUserHOC } from '../../../widgets/users/hocs/CreateUserHOC.tsx';

export const CreateUserPage = CreateUserHOC(UserForm);
