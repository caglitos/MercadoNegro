import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";

const router = () => {
  return (
    <BrowserRouter>
      <Routes>
		  <Route path="/" element={<div></div>} />

      </Routes>
    </BrowserRouter>
  );
};

export default router;