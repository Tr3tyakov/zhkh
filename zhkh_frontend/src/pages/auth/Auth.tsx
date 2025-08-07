import { Box, Collapse } from '@mui/material';
import Lottie from 'lottie-react';
import diagram from '../../../public/diagram.json';
import { SignUp } from '../../widgets/auth/signUp/SignUp.tsx';
import { useEffect, useState } from 'react';
import { SignIn } from '../../widgets/auth/signIn/SignIn.tsx';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../app/infrastructures/providers/userProvider/useUser.constants.ts';
import { useInjection } from '../../app/domain/hooks/useInjection.ts';
import { ICookieService } from '../../app/domain/cookie/cookieService.interfaces.ts';
import { CookieServiceKey } from '../../app/domain/cookie/key.ts';

export const Auth = () => {
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const cookieService = useInjection<ICookieService>(CookieServiceKey);
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookieService.getToken(ACCESS_TOKEN);
        if (token) {
            navigate('/houses');
        }
    }, []);

    const changeIsSignIn = () => {
        setIsSignIn((state) => !state);
    };

    return (
        <Box display="flex" gap="20px" p="20px">
            <Box
                width="50%"
                height="100%"
                padding="120px 40px 0 40px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                {/*<Collapse in={!isSignIn} orientation="vertical" unmountOnExit>*/}
                {/*    <SignUp changeIsSignIn={changeIsSignIn} />*/}
                {/*</Collapse>*/}
                <Collapse in={isSignIn} orientation="vertical" unmountOnExit>
                    <SignIn changeIsSignIn={changeIsSignIn} />
                </Collapse>
            </Box>
            <Box position="relative" width="50%">
                <Box position="absolute" top="50px" left="-100px" right="0" bottom="0">
                    <Lottie width="100%" animationData={diagram} />
                </Box>
            </Box>
        </Box>
    );
};
