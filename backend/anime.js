import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/upcoming", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 42;

  const query = `
    query ($page: Int, $perPage: Int) {
      Page(perPage: $perPage, page: $page) {
        pageInfo {
          total
          currentPage
          lastPage
        }
        airingSchedules(sort: TIME, notYetAired: true) {
          episode
          airingAt
          timeUntilAiring
          media {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { page, perPage } }),
    });

    const data = await response.json();
    res.json(data.data.Page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
