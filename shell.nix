{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    gnumake
    nodejs_20
    bun
  ];
}
