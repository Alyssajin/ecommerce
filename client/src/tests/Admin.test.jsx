import React from "react";
import Admin from "../components/admin/Admin";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import { fireEvent } from "@testing-library/react";

jest.mock("@auth0/auth0-react");
jest.mock('../AuthTokenContext', () => ({
    useAuthToken: jest.fn(),
}));
describe("Admin Component test", () => {

    beforeEach(() => {
        useAuth0.mockReturnValue({
            isAuthenticated: true,
        });
        
    });

    test("render without crashing", () => {
        const mockUser = { name: 'John Doe', email: 'john.doe@example.com' };
        const mockAccessToken = 'mockAccessToken123';

        require('@auth0/auth0-react').useAuth0.mockReturnValue({
            user: mockUser,
        });

        require('../AuthTokenContext').useAuthToken.mockReturnValue({
            accessToken: mockAccessToken,
        });
        render(<Admin />);
        expect(screen.getByText("Admin Page")).toBeInTheDocument();
    });

    test("add product button", () => {
        render(<Admin />);
        expect(screen.getByText("Add Product")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Add Product"));
        expect(screen.getByText("Product title")).toBeInTheDocument();
        expect(screen.getByText("Product Price")).toBeInTheDocument();
    });

    test("display product", () => {
        render(<Admin />);
        expect(screen.getByText("Display Products")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Display Products"));
        expect(screen.getByText("Filter By:")).toBeInTheDocument();
    });

});