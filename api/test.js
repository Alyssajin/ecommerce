import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import axios from "axios";

