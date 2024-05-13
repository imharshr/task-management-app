# backend/main.py

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from tasks import router as tasks_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# Include the tasks router
app.include_router(tasks_router)


# # Define a catch-all route that redirects all requests to the /health endpoint
# @app.middleware("http")
# async def redirect_to_health(request: Request, call_next):
#     response = await call_next(request)
#     if response.status_code == 404:
#         return RedirectResponse(url="/health")
#     return response
