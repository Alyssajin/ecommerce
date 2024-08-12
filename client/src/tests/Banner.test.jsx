import React from "react";
import Banner from "../components/banner/Banner";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

describe("Banner Component test", () => {
    const mockLoginWithRedirect = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useAuth0.mockReturnValue({
            isAuthenticated: false,
            loginWithRedirect: mockLoginWithRedirect,
        });
        useNavigate.mockReturnValue(mockNavigate);
    });

    test("render without crashing", () => {
        render(<Banner />);
        expect(screen.getByText("BDG JEANS · BUY ONE, GET ONE 50% OFF")).toBeInTheDocument();
    });

    test("display login button when user is not authenticated", () => {
        render(<Banner />);
        expect(screen.getByText("Sign in")).toBeInTheDocument();
    });

    test("Login button calls loginWithRedirect", () => {
        render(<Banner />);
        fireEvent.click(screen.getByText("Sign in"));
        expect(mockLoginWithRedirect).toHaveBeenCalled();
    });

});