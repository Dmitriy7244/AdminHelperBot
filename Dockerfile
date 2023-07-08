FROM denoland/deno
WORKDIR /app
USER deno
# COPY deps.ts .
# RUN deno cache deps.ts
# ADD src .
# RUN deno cache src/main/mod.ts
ADD . .
CMD deno task start
