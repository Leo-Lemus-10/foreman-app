type Primitive = string | number | boolean | null;

type QueryOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  prefer?: string;
  select?: string;
  maybeSingle?: boolean;
};

class QueryBuilder<T> {
  private filters: string[] = [];
  private selected = "*";

  constructor(
    private readonly url: string,
    private readonly key: string,
    private readonly table: string,
  ) {}

  select(columns = "*") {
    this.selected = columns;
    return this;
  }

  eq(column: string, value: Primitive) {
    this.filters.push(`${column}=eq.${encodeURIComponent(String(value))}`);
    return this;
  }

  async single() {
    return this.execute({ maybeSingle: true });
  }

  async maybeSingle() {
    return this.execute({ maybeSingle: true });
  }

  async upsert(payload: Partial<T>, options?: { onConflict?: string }) {
    const query = new URL(`${this.url}/rest/v1/${this.table}`);
    if (options?.onConflict) {
      query.searchParams.set("on_conflict", options.onConflict);
    }

    return this.execute({
      method: "POST",
      body: payload,
      select: this.selected,
      prefer: "resolution=merge-duplicates,return=representation",
    }, query.toString());
  }

  then<TResult1 = Awaited<ReturnType<QueryBuilder<T>["execute"]>>, TResult2 = never>(
    onfulfilled?: ((value: Awaited<ReturnType<QueryBuilder<T>["execute"]>>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(options: QueryOptions = {}, overrideUrl?: string) {
    const query = overrideUrl ? new URL(overrideUrl) : new URL(`${this.url}/rest/v1/${this.table}`);

    if (options.method !== "POST") {
      query.searchParams.set("select", this.selected);
      this.filters.forEach((filter) => {
        const [k, v] = filter.split("=");
        query.searchParams.set(k, v);
      });
    } else if (options.select) {
      query.searchParams.set("select", options.select);
    }

    const response = await fetch(query.toString(), {
      method: options.method ?? "GET",
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        "Content-Type": "application/json",
        ...(options.prefer ? { Prefer: options.prefer } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const payload = response.status === 204 ? null : await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: payload,
      };
    }

    if (options.maybeSingle) {
      return {
        data: Array.isArray(payload) ? payload[0] ?? null : payload,
        error: null,
      };
    }

    return {
      data: payload,
      error: null,
    };
  }
}

export function createClient(url: string, key: string) {
  return {
    from<T>(table: string) {
      return new QueryBuilder<T>(url, key, table);
    },
  };
}
