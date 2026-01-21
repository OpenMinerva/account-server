require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 40400;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
