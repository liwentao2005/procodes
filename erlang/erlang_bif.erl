#!/usr/bin/env escript
-module(erlang_bif).

-export([test/0]).

test() ->
    erlang:append_element({one, two, tst}, good),
    apply(lists, reverse, [[a, b, c]]),
    Bin = <<1,2,3,4,5,6,7,8,9,10>>,
    binary_part(Bin,{byte_size(Bin), -5}),
    element(2, {a,b,ch}),
    erlang:insert_element(2, {one, two, three, fore}, new),
    erlang:make_tuple(4, []),
    setelement(2, {10, old, element, position}, new),
    %% Host = www
    [Host|_] = string:tokens("www.google.com", "."),
    io:format("[Host|_] = string:tokens(\"www.google.com\", \".\"). Host = ~p~n", [Host]),
    ok.

