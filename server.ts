import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { connectWebSocket } from "https://deno.land/std@0.67.0/ws/mod.ts";

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "The Hound of the Baskervilles",
  author: "Conan Doyle, Arthur",
});

books.set("2", {
  id: "2",
  title: "How to be a Pro Basket-baller",
  author: "kelvin stone, Arthur",
});

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/book", (context) => {
    context.response.body = Array.from(books.values());
  })
  .get("/book/:id", (context) => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      context.response.body = books.get(context.params.id);
    }
  })
  .post("/book", async (context) => {
    const value = await context.request.body().value;
    books.set(value.id, { ...value });
    context.response.body = Array.from(books.values());
    console.log(value);
  })
  .patch("/book/:id", async (context)=>{
    if (context.params && context.params.id && books.has(context.params.id)) {
      const value = await context.request.body().value;
      const title = value.title
      books.get(context.params.id).title = title
      context.response.body = books.get(context.params.id);
  }
})

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
