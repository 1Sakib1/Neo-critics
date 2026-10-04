import json
import random
from datetime import datetime

# Simulated data processing / ML analysis
movies = [
    {"id": 1, "title": "Oppenheimer", "genre": "Biography", "rating": 4.8, "trend_score": random.randint(80, 100)},
    {"id": 2, "title": "Dune: Part Two", "genre": "Sci-Fi", "rating": 4.9, "trend_score": random.randint(85, 100)},
    {"id": 3, "title": "The Batman", "genre": "Action", "rating": 4.7, "trend_score": random.randint(70, 95)},
    {"id": 4, "title": "Interstellar", "genre": "Sci-Fi", "rating": 4.9, "trend_score": random.randint(80, 99)}
]

data = {
    "generated_at": datetime.utcnow().isoformat(),
    "movies": sorted(movies, key=lambda x: x["trend_score"], reverse=True),
    "insights": {
        "top_genre": "Sci-Fi",
        "avg_rating": sum(m["rating"] for m in movies) / len(movies)
    }
}

with open("src/data/movies.json", "w") as f:
    json.dump(data, f, indent=4)

print("Data pipeline executed successfully. movies.json generated.")
