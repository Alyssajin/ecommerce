import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthDebugger from '../components/authDebugger/AuthDebugger';
import { useAuth0 } from "@auth0/auth0-react";

jest.mock('@auth0/auth0-react');
jest.mock('../AuthTokenContext', () => ({
    useAuthToken: jest.fn(),
}));
describe('AuthDebugger Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        useAuth0.mockReturnValue({
            isAuthenticated: true,
        });

    });

    test('renders the AuthDebugger component with access token and user info', () => {
        // Mock return values for useAuth0 and useAuthToken
        const mockUser = { name: 'John Doe', email: 'john.doe@example.com' };
        const mockAccessToken = 'mockAccessToken123';

        require('@auth0/auth0-react').useAuth0.mockReturnValue({
            user: mockUser,
        });

        require('../AuthTokenContext').useAuthToken.mockReturnValue({
            accessToken: mockAccessToken,
        });

        // Render the component
        render(<AuthDebugger />);

        // Assert the access token is displayed
        expect(screen.getByText('Access Tokon:')).toBeInTheDocument();
        expect(screen.getByText(/mockAccessToken123/)).toBeInTheDocument();

        // You can also use toHaveTextContent to match the content within the <pre> tag
        expect(screen.getByText(/Access Tokon:/).parentElement).toHaveTextContent(/mockAccessToken123/);

        // Assert the user info is displayed
        expect(screen.getByText('User Info')).toBeInTheDocument();
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
        expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
    });
});
