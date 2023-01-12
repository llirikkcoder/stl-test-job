import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiUrl } from "./config";

export const apiUrl = "http://localhost:3001/";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch(`${apiUrl}/users`);
  const users = await response.json();
  return users;
});

export const sortUsers = createAsyncThunk(
  "users/sortUsers",
  async (sortField, getState) => {
    const users = getState().users;
    let sortedUsers = [...users];
    if (sortField === "age") {
      sortedUsers = sortedUsers.sort((a, b) => a[sortField] - b[sortField]);
    } else {
      sortedUsers = sortedUsers.sort((a, b) => {
        if (a[sortField].toLowerCase() < b[sortField].toLowerCase()) {
          return -1;
        }
        if (a[sortField].toLowerCase() > b[sortField].toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }
    return sortedUsers;
  }
);

export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  let response;
  if (user.id) {
    // update existing user
    response = await fetch(`${apiUrl}/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  } else {
    // create new user
    response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  }
  const savedUser = await response.json();
  return savedUser;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await fetch(`${apiUrl}/users/${id}`, {
    method: "DELETE",
  });
  return id;
});

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sortUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(sortUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(sortUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUserIndex = state.data.findIndex(
          (user) => user.id === action.payload.id
        );
        state.data[updatedUserIndex] = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((user) => user.id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {} = usersSlice.actions;

export default usersSlice.reducer;
