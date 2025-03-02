import { describe, expect, test } from "vitest";
import { $path } from "../tests/generated/safe-routes/index";

describe("safeRoute", () => {
  // Case 1: No params, no search params
  test("static route without params", () => {
    expect($path("/")).toBe("/");
  });

  // Case 2: Only search params)
  describe("routes with only search params", () => {
    test("required search params", () => {
      expect($path("/shop/", { isRequired: true, tags: ["a", "b"] })).toBe(
        "/shop/?isRequired=true&tags=a&tags=b",
      );
    });

    test("optional search params", () => {
      expect($path("/login/", { redirect: "/dashboard" })).toBe(
        "/login/?redirect=%2Fdashboard",
      );
      expect($path("/login/")).toBe("/login/");
    });
  });

  // Case 3: Only dynamic params
  describe("routes with only dynamic params", () => {
    test("required params", () => {
      expect($path("/users/[id]/", { id: "123" })).toBe("/users/123/");
    });

    test("optional params (catch-all)", () => {
      expect(
        $path("/products/[[...filters]]/", { filters: [] }, { page: 1 }),
      ).toBe("/products/?page=1");
      expect(
        $path(
          "/products/[[...filters]]/",
          { filters: ["sale", "winter"] },
          { page: 1 },
        ),
      ).toBe("/products/sale/winter/?page=1");
    });

    test("required params (catch-all)", () => {
      expect(
        $path(
          "/shop/[...categories]/",
          { categories: ["men", "shoes"] },
          { page: 1 },
        ),
      ).toBe("/shop/men/shoes/?page=1");
    });
  });

  // Case 4: Both params and search params
  describe("routes with both params and search params", () => {
    test("required params and required search params", () => {
      expect($path("/users/[id]/", { id: "123" }, { tab: "profile" })).toBe(
        "/users/123/?tab=profile",
      );
    });

    test("required params and optional search params", () => {
      expect($path("/users/[id]/", { id: "123" })).toBe("/users/123/");
      expect($path("/users/[id]/", { id: "123" }, { tab: "profile" })).toBe(
        "/users/123/?tab=profile",
      );
    });

    test("optional params and required search params", () => {
      expect(
        $path("/products/[[...filters]]/", { filters: [] }, { page: 1 }),
      ).toBe("/products/?page=1");
      expect(
        $path("/products/[[...filters]]/", { filters: ["sale"] }, { page: 1 }),
      ).toBe("/products/sale/?page=1");
    });

    test("optional params and optional search params", () => {
      expect(
        $path("/products/[[...filters]]/", { filters: [] }, { page: 1 }),
      ).toBe("/products/?page=1");
      expect(
        $path("/products/[[...filters]]/", { filters: ["sale"] }, { page: 1 }),
      ).toBe("/products/sale/?page=1");
      expect(
        $path(
          "/products/[[...filters]]/",
          { filters: ["sale"] },
          { sort: "asc", page: 1 },
        ),
      ).toBe("/products/sale/?sort=asc&page=1");
    });
  });

  // Case 5: Multiple dynamic params
  test("multiple dynamic params", () => {
    expect(
      $path(
        "/users/[userId]/posts/[postId]/",
        {
          userId: "123",
          postId: "456",
        },
        { page: 1 },
      ),
    ).toBe("/users/123/posts/456/?page=1");
  });

  // Case 6: Special characters and encoding
  test("handles special characters and encoding", () => {
    expect($path("/search/", { q: "hello world" })).toBe(
      "/search/?q=hello+world",
    );
    expect(
      $path(
        "/users/[id]/",
        { id: "123+456" },
        { tab: "profile", special: "&special=" },
      ),
    ).toBe("/users/123+456/?tab=profile&special=%26special%3D");
  });

  // Case 7: Array parameters
  test("handles array parameters", () => {
    expect($path("/shop/", { tags: ["t1", "t2"], isRequired: true })).toBe(
      "/shop/?tags=t1&tags=t2&isRequired=true",
    );
  });

  // Case 8: Kebab case conversion
  test("converts kebab case to camel case in params", () => {
    expect($path("/users/[user-id]/", { userId: "123" })).toBe("/users/123/");
  });

  // Case 9: Snake case conversion
  test("converts snake case to camel case in params", () => {
    expect($path("/users/[user_id]/", { userId: 1 })).toBe("/users/1/");
  });
});
