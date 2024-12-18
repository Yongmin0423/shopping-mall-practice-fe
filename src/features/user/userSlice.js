import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;
      sessionStorage.setItem("token", token);
      // 성공
      //loginpage
      //토큰저장 1. localStorage 2. sessionSt

      return response.data;
    } catch (error) {
      //실패
      //실패 시 생긴 에러 값을 reducer에 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { token });
      sessionStorage.setItem("token", response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const logout = () => (dispatch) => {
  dispatch(userSlice.actions.logout()); // user 상태를 null로 변경
};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      //성공
      //1. 성공 토스트 메시지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다!",
          status: "success",
        })
      );
      //2. 로그인 페이지 리다이렉트
      navigate("/login");
      return response.data.data;
    } catch (error) {
      //실패
      //1. 실패 토스트 메시지 보여준다
      dispatch(
        showToastMessage({
          message: "회원가입을 실패했습니다",
          status: "error",
        })
      );
      //2. 에러값을 저장한다
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getState().user.user._id;
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async ({ data, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put("/user/update", data);
      dispatch(
        showToastMessage({
          status: "success",
          message: "정보 변경에 성공하였습니다.",
        })
      );
      navigate("/");
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          status: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logout: (state) => {
      state.user = null; // 로그아웃 시 user 상태를 null로 설정
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(loginWithGoogle.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
