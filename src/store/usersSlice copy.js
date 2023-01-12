import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiUrl } from ".";

export const apiUrl = "http://localhost:3001/";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch(`${apiUrl}/users`);
  const users = await response.json();
  return users;
});

export const sortUsersThunk = createAsyncThunk(
  "users/sortUsers",
  async (field) => {
    let response;
    if (field === "age") {
      response = await fetch(`${apiUrl}/users?_sort=age`);
    } else {
      response = await fetch(`${apiUrl}/users?_sort=${field}`);
    }
    const users = await response.json();
    return users;
  }
);

// export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
//   let response;
//   if (user.id) {
//     // update existing user
//     response = await fetch(`${apiUrl}/users/${user.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(user),
//     });
//   } else {
//     // create new user
//     response = await fetch(`${apiUrl}/users`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(user),
//     });
//   }
//   const savedUser = await response.json();
//   return savedUser;
// });

// export const deleteUser = createAsyncThunk(
//   "users/deleteUser",
//   async (userId) => {
//     await fetch(`${apiUrl}/users/${userId}`, {
//       method: "DELETE",
//     });
//     return userId;
//   }
// );

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sortUsers, (state, action) => {
        const { field } = action.payload;
        let sortedUsers = [...state.data];
        if (field === "age") {
          sortedUsers = sortedUsers.sort((a, b) => a[field] - b[field]);
        } else {
          sortedUsers = sortedUsers.sort((a, b) => {
            if (a[field].toLowerCase() < b[field].toLowerCase()) {
              return -1;
            }
            if (a[field].toLowerCase() > b[field].toLowerCase()) {
              return 1;
            }
            return 0;
          });
        }
        state.data = sortedUsers;
      });

    // .addCase(updateUser.pending, (state) => {
    //   state.updating = true;
    //   state.updateError = null;
    // })
    // .addCase(updateUser.fulfilled, (state, action) => {
    //   state.updating = false;
    //   state.updateError = null;
    //   const updatedUsers = state.data.map((user) => {
    //     if (user.id === action.payload.id) {
    //       return action.payload;
    //     }
    //     return user;
    //   });
    //   state.data = updatedUsers;
    // })
    // .addCase(updateUser.rejected, (state, action) => {
    //   state.updating = false;
    //   state.updateError = action.error.message;
    // })
    // .addCase(deleteUser.pending, (state) => {
    //   state.deleting = true;
    //   state.deleteError = null;
    // })
    // .addCase(deleteUser.fulfilled, (state, action) => {
    //   state.deleting = false;
    //   state.deleteError = null;
    //   state.data = state.data.filter((user) => user.id !== action.payload);
    // })
    // .addCase(deleteUser.rejected, (state, action) => {
    //   state.deleting = false;
    //   state.deleteError = action.error.message;
    // })
    // .addCase(createUser.pending, (state) => {
    //   state.creating = true;
    //   state.createError = null;
    // })
    // .addCase(createUser.fulfilled, (state, action) => {
    //   state.creating = false;
    //   state.createError = null;
    //   state.data = [...state.data, action.payload];
    // })
    // .addCase(createUser.rejected, (state, action) => {
    //   state.creating = false;
    //   state.createError = action.error.message;
    // });
  },
});

export const { sortUsers } = usersSlice.actions;
export default usersSlice;
