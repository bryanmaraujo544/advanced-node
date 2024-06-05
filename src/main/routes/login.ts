import { Express, Router } from "express";

export default (router: Router): void => {
    router.post("/api/login/facebook", (req, res) => {
        res.send({
            data: "Bryan is the best developer of his home!",
        });
    });
};
