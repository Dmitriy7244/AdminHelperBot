FROM denoland/deno
WORKDIR /app
COPY deps.ts .
RUN deno cache deps.ts
COPY . .
CMD deno task start
